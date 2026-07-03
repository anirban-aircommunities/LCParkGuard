import React, { JSX } from 'react';
import WebView from 'react-native-webview';

interface Svg {
  svgData?: any;
  svgHeight?: any;
  svgWidth?: any;
}

export const SvgComponent: React.FC<Svg> = ({svgData, svgHeight, svgWidth}): JSX.Element => (
    <WebView
        // style={{ height: '10%', width: '25%', backgroundColor: '#fff' }}
        scrollEnabled={false}
        source={{
            html: `<html><head><style>html, body { margin:0; padding:0; overflow:hidden } svg { position:fixed; top:0; left:0; ${"height:" + svgHeight}; ${"width:" + svgWidth} }</style></head><body>${svgData}</body></html>`,
        }}
    />
)