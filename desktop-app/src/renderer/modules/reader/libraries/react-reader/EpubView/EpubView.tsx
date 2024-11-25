/* eslint-disable react/require-default-props */
import React, { Component } from 'react';
import Epub, {
  Book,
  type NavItem,
  type Contents,
  type Rendition,
  type Location,
} from 'epubjs';
import { type RenditionOptions } from 'epubjs/types/rendition';
import { type BookOptions } from 'epubjs/types/book';
import { EpubViewStyle as defaultStyles, type IEpubViewStyle } from './style';

export type RenditionOptionsFix = RenditionOptions & {
  allowPopups: boolean;
};

export type IToc = {
  label: string;
  href: string;
};

export type IEpubViewProps = {
  url: string | ArrayBuffer;
  epubInitOptions?: Partial<BookOptions>;
  epubOptions?: Partial<RenditionOptionsFix>;
  epubViewStyles?: IEpubViewStyle;
  loadingView?: React.ReactNode;
  location: string | number | null;
  locationChanged(value: string): void;
  tocChanged?(value: NavItem[]): void;
  getRendition?(rendition: Rendition): void;
  handleKeyPress?(): void;
  handleTextSelected?(cfiRange: string, contents: Contents): void;
};
type IEpubViewState = {
  isLoaded: boolean;
  toc: NavItem[];
};

export class EpubView extends Component<IEpubViewProps, IEpubViewState> {
  viewerRef = React.createRef<HTMLDivElement>();

  location?: string | number | null;

  book?: Book;

  rendition?: Rendition;

  prevPage?: () => void;

  nextPage?: () => void;

  constructor(props: IEpubViewProps) {
    super(props);
    this.location = props.location;
    this.book = undefined;
    this.rendition = undefined;
    this.prevPage = undefined;
    this.nextPage = undefined;
    this.state = {
      isLoaded: false,
      toc: [],
    };
  }

  componentDidMount() {
    this.initBook();
    document.addEventListener('keyup', this.handleKeyPress, false);
  }

  shouldComponentUpdate(nextProps: IEpubViewProps) {
    const { isLoaded } = this.state;
    const { location, url } = this.props;
    return (
      !isLoaded || nextProps.location !== location || nextProps.url !== url
    );
  }

  componentDidUpdate(prevProps: IEpubViewProps) {
    const { location, url } = this.props;
    if (prevProps.location !== location && this.location !== location) {
      this.rendition?.display(`${location}`);
    }
    if (prevProps.url !== url) {
      this.initBook();
    }
  }

  componentWillUnmount() {
    if (this.book) {
      this.book.destroy();
    }
    this.book = undefined;
    this.rendition = undefined;
    this.prevPage = undefined;
    this.nextPage = undefined;

    document.removeEventListener('keyup', this.handleKeyPress, false);
  }

  handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight' && this.nextPage) {
      this.nextPage();
    }
    if (event.key === 'ArrowLeft' && this.prevPage) {
      this.prevPage();
    }
  };

  onLocationChange = (loc: Location) => {
    const { location, locationChanged } = this.props;
    const newLocation = `${loc.start}`;
    if (location !== newLocation) {
      this.location = newLocation;
      if (locationChanged) {
        locationChanged(newLocation);
      }
    }
  };

  registerEvents() {
    const { handleKeyPress, handleTextSelected } = this.props;
    if (this.rendition) {
      this.rendition.on('locationChanged', this.onLocationChange);
      this.rendition.on('keyup', handleKeyPress || this.handleKeyPress);
      if (handleTextSelected) {
        this.rendition.on('selected', handleTextSelected);
      }
    }
  }

  initReader() {
    const { toc } = this.state;
    const { location, epubOptions, getRendition } = this.props;
    if (this.viewerRef.current) {
      const node = this.viewerRef.current;
      if (this.book) {
        const rendition = this.book.renderTo(node, {
          width: '100%',
          height: '100%',
          ...epubOptions,
        });
        this.rendition = rendition;
        this.prevPage = () => {
          rendition.prev();
        };
        this.nextPage = () => {
          rendition.next();
        };
        this.registerEvents();
        if (getRendition) {
          getRendition(rendition);
        }
        if (typeof location === 'string' || typeof location === 'number') {
          rendition.display(`${location}`);
        } else if (toc.length > 0 && toc[0].href) {
          rendition.display(toc[0].href);
        } else {
          rendition.display();
        }
      }
    }
  }

  initBook() {
    const { url, tocChanged, epubInitOptions } = this.props;
    if (this.book) {
      this.book.destroy();
    }
    this.book = Epub(url, epubInitOptions);
    this.book.loaded.navigation
      .then(({ toc }) => {
        return this.setState(
          {
            isLoaded: true,
            toc,
          },
          () => {
            if (tocChanged) {
              tocChanged(toc);
            }
            this.initReader();
          },
        );
      })
      .catch(() => {
        // todo: display an error message on the toc
      });
  }

  renderBook() {
    const { epubViewStyles = defaultStyles } = this.props;
    return <div ref={this.viewerRef} style={epubViewStyles.view} />;
  }

  render() {
    const { isLoaded } = this.state;
    const { loadingView = null, epubViewStyles = defaultStyles } = this.props;
    return (
      <div style={epubViewStyles.viewHolder}>
        {(isLoaded && this.renderBook()) || loadingView}
      </div>
    );
  }
}
