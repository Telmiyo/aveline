import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { IReactReaderStyle, ReactReaderStyle } from 'react-reader';
import { Rendition } from 'epubjs';
import { ITocElement } from '../consts/interfaces';

export type ITheme = 'light' | 'dark';

class ReaderManager {
  private readonly themes: IReactReaderStyle;

  // TODO: load settings from user config
  private isTwoColumns: boolean = true;

  private rendition?: Rendition;

  private toc: ITocElement[] | null = null;

  constructor() {
    this.themes = { ...ReactReaderStyle };
  }

  public setRendition(rendition: Rendition): void {
    this.rendition = rendition;
  }

  public getRendition(): Rendition | undefined {
    return this.rendition;
  }

  public setTOC(toc: ITocElement[]): void {
    this.toc = toc;
  }

  public async getTOC(): Promise<ITocElement[]> {
    if (this.toc) {
      return this.toc;
    }

    return new Promise((resolve) => {
      const checkTOC = setInterval(() => {
        if (this.toc) {
          clearInterval(checkTOC);
          resolve(this.toc);
        }
      }, 100);
    });
  }

  public async getCurrentChapterID(): Promise<string | undefined> {
    return new Promise((resolve) => {
      const findChapterInToc = (
        toc: ITocElement[],
        href: string,
      ): string | undefined => {
        // eslint-disable-next-line no-restricted-syntax
        for (const item of toc) {
          if (item.href === href) {
            return item.id;
          }
          if (item.subitems?.length) {
            const childChapterId = findChapterInToc(item.subitems, href);
            if (childChapterId) {
              return childChapterId;
            }
          }
        }
        return undefined;
      };

      if (this.rendition && this.rendition.location) {
        const { href } = this.rendition.location.start;
        const chapterId = findChapterInToc(this.toc || [], href);
        resolve(chapterId);
      } else {
        const checkLocation = setInterval(() => {
          if (this.rendition && this.rendition.location) {
            clearInterval(checkLocation);
            const { href } = this.rendition.location.start;
            const chapterId = findChapterInToc(this.toc || [], href);
            resolve(chapterId);
          }
        }, 100);
      }
    });
  }

  public toggleColumns(): void {
    this.isTwoColumns = !this.isTwoColumns;
    const spread = this.isTwoColumns ? 'auto' : 'none';
    this.rendition?.spread(spread);
  }

  public updateTheme(theme: ITheme): void {
    if (this.rendition) {
      const { themes } = this.rendition;
      themes.override('color', theme === 'dark' ? '#fff' : '#000');
      themes.override('background', theme === 'dark' ? '#000' : '#ece8dd');
    }
  }

  public getTheme(theme: ITheme): IReactReaderStyle {
    return theme === 'dark' ? this.getDarkTheme() : this.getLightTheme();
  }

  private getLightTheme(): IReactReaderStyle {
    return {
      ...this.themes,
      arrow: {
        ...ReactReaderStyle.arrow,
        color: 'black',
      },
      arrowHover: {
        ...ReactReaderStyle.arrowHover,
        color: '#ccc',
      },
      readerArea: {
        ...ReactReaderStyle.readerArea,
        backgroundColor: '#ece8dd',
        transition: undefined,
      },
    };
  }

  private getDarkTheme(): IReactReaderStyle {
    return { ...this.themes };
  }

  public cleanup(): void {
    this.rendition = undefined;
    this.toc = null;
    this.isTwoColumns = false;
  }
}

// provider
const ReaderContext = createContext<ReaderManager | undefined>(undefined);
export function ReaderProvider({ children }: { children: ReactNode }) {
  const [readerManager] = useState(() => new ReaderManager());

  useEffect(() => {
    // Cleanup when the provider is unmounted
    return () => {
      readerManager.cleanup();
    };
  }, [readerManager]);

  return (
    <ReaderContext.Provider value={readerManager}>
      {children}
    </ReaderContext.Provider>
  );
}

// hook
export const useReaderManager = () => {
  const context = useContext(ReaderContext);
  if (!context) {
    throw new Error('useReaderManager must be used within a ReaderProvider');
  }
  return context;
};
