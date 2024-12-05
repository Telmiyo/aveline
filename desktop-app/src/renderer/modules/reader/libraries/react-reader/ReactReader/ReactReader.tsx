/* eslint-disable */
import React, { PureComponent } from 'react';
import { NavItem } from 'epubjs';
import { EpubView, IEpubViewProps } from '../EpubView/EpubView';
import { IEpubViewStyle } from '../EpubView/style';
import { ReactReaderStyle as defaultStyles, IReactReaderStyle } from './style';

export type IReactReaderProps = IEpubViewProps & {
  readerStyles?: IReactReaderStyle;
  epubViewStyles?: IEpubViewStyle;
  isRTL?: boolean;
};

export class ReactReader extends PureComponent<IReactReaderProps, {}> {
  readerRef = React.createRef<EpubView>();

  constructor(props: IReactReaderProps) {
    super(props);
    this.state = {};
  }

  next = () => {
    const node = this.readerRef.current;
    if (node && node.nextPage) {
      node.nextPage();
    }
  };

  prev = () => {
    const node = this.readerRef.current;
    if (node && node.prevPage) {
      node.prevPage();
    }
  };

  onTocChange = (toc: NavItem[]) => {
    const { tocChanged } = this.props;
    this.setState({}, () => {
      if (tocChanged) {
        tocChanged(toc);
      }
    });
  };

  render() {
    const {
      loadingView,
      readerStyles = defaultStyles,
      locationChanged,
      epubViewStyles,
      isRTL = false,
      url,
      epubInitOptions,
      epubOptions,
      handleKeyPress,
      handleTextSelected,
      getRendition,
      location,
      tocChanged,
    } = this.props;

    return (
      <div style={readerStyles.container}>
        <div style={{ ...readerStyles.readerArea }}>
          <div style={readerStyles.reader}>
            <EpubView
              ref={this.readerRef}
              loadingView={
                loadingView === undefined ? (
                  <div style={readerStyles.loadingView}>Loading…</div>
                ) : (
                  loadingView
                )
              }
              epubViewStyles={epubViewStyles}
              url={url}
              epubInitOptions={epubInitOptions}
              epubOptions={epubOptions}
              handleKeyPress={handleKeyPress}
              handleTextSelected={handleTextSelected}
              getRendition={getRendition}
              location={location}
              tocChanged={tocChanged ? this.onTocChange : undefined}
              locationChanged={locationChanged}
            />
          </div>
          <button
            type="button"
            style={{ ...readerStyles.arrow, ...readerStyles.prev }}
            onClick={isRTL ? this.next : this.prev}
          >
            ‹
          </button>
          <button
            type="button"
            style={{ ...readerStyles.arrow, ...readerStyles.next }}
            onClick={isRTL ? this.prev : this.next}
          >
            ›
          </button>
        </div>
      </div>
    );
  }
}
