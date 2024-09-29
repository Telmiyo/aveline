import { IReactReaderStyle, ReactReaderStyle } from 'react-reader';

export type ITheme = 'light' | 'dark';

export class ReaderManager {
  private readonly themes: IReactReaderStyle;

  constructor() {
    this.themes = { ...ReactReaderStyle };
  }

  public getTheme(theme: ITheme): IReactReaderStyle {
    return theme === 'dark' ? this.getDarkTheme() : this.getLightTheme();
  }

  // eslint-disable-next-line class-methods-use-this
  public updateTheme(rendition: any, theme: ITheme): void {
    const { themes } = rendition;
    switch (theme) {
      case 'light':
        themes.override('color', '#000');
        themes.override('background', '#ece8dd');
        break;
      case 'dark':
        themes.override('color', '#fff');
        themes.override('background', '#000');
        break;
      default:
        break;
    }
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
}
