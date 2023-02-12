import React from "react";
import {
  Linking,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { WebView as RNWebViewWeb } from "react-native-web-webview";
import { WebView as RNWebViewMobile } from "react-native-webview";

export interface HCaptchaMessage {
  event:
    | "open"
    | "cancel"
    | "close"
    | "data-expired"
    | "challenge-expired"
    | "data"
    | "error";
  data: string;
}

interface HCaptchaProps {
  siteKey: string;
  theme?: "dark" | "light";
  onMessage: (message: HCaptchaMessage) => void;
}

const buildHcaptchaApiUrl = (
  siteKey: string,
  languageCode: string,
  theme: string
) => {
  var url =
    "https://hcaptcha.com/1/api.js?render=explicit&onload=onLoadCallback";
  url += `&host=${siteKey || "missing-sitekey"}.react-native.hcaptcha.com`;
  if (languageCode) {
    url += "&hl=" + languageCode;
  }
  if (typeof theme === "object") {
    url += "&custom=true";
  }
  return url;
};

const patchPostMessageJsCode = `(${String(function () {
  let originalPostMessage: Function;

  // @ts-ignore
  if (window.ReactNativeWebView) {
    // @ts-ignore
    originalPostMessage = window.ReactNativeWebView.postMessage;
  } else if (window.parent) {
    originalPostMessage = window.parent.postMessage;
  } else {
    originalPostMessage = window.postMessage;
  }

  // @ts-ignore
  const patchedPostMessage = function (message, targetOrigin, transfer) {
    originalPostMessage(message, targetOrigin, transfer);
  };
  patchedPostMessage.toString = function () {
    return String(Object.hasOwnProperty).replace(
      "hasOwnProperty",
      "postMessage"
    );
  };
  // @ts-ignore
  originalPostMessage.postMessage = patchedPostMessage;
})})();`;

const getWebViewComponent = () => {
  if (Platform.isMobile) return RNWebViewMobile;
  return RNWebViewWeb;
};

function HCaptcha({ siteKey, theme, onMessage }: HCaptchaProps) {
  theme = theme ?? "dark";
  const WebView = getWebViewComponent();
  const dimensions = useWindowDimensions();
  const apiUrl = buildHcaptchaApiUrl(siteKey, "en", theme);

  const html = React.useMemo(
    () => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    
        <script
          src="${apiUrl}"
          async
          defer
        ></script>
        <script type="text/javascript">
          window.onLoadCallback = () => {
            window.hcaptcha.render("h-captcha", getRenderConfig());
            window.hcaptcha.execute({});
          };
    
          window.onDataCallback = (res) => {
            window.RNPostMessage({"event": "data", "data": res});
          };
    
          window.onCancel = () => {
            window.RNPostMessage({"event": "cancel"});
          };
    
          window.onOpen = () => {
            window.RNPostMessage({"event": "open"});
          };
    
          window.onDataExpiredCallback = (error) => {
            window.RNPostMessage({"event": "data-expired", "data": error});
          };
    
          window.onChalExpiredCallback = (error) => {
            window.RNPostMessage({"event": "challenge-expired", "data": error});
          };
    
          window.onDataErrorCallback = (error) => {
            window.RNPostMessage({"event": "error", "data": error});
          };
    
          window.getRenderConfig = () => ({
            sitekey: "${siteKey}",
            size: "invisible",
            callback: onDataCallback,
            "close-callback": onCancel,
            "open-callback": onOpen,
            "expired-callback": onDataExpiredCallback,
            "chalexpired-callback": onChalExpiredCallback,
            "error-callback": onDataErrorCallback,
            theme: "${theme}",
          });

          window.RNPostMessage = (data) => {
            const payload = JSON.stringify({source: "hcaptcha", payload: data})

            if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(payload);
            } else if (window.parent) {
                window.parent.postMessage(payload, "*");
            } else if (window.postMessage) {
                window.postMessage(payload, "*");
            } else {
                console.error("RNPostMessage: No postMessage function found");
            }
          }
        </script>
      </head>
      <body>
        <div id="h-captcha"></div>
      </body>
    </html>
    
`,
    [siteKey, theme]
  );

  // This shows ActivityIndicator till webview loads hCaptcha images
  const renderLoading = React.useCallback(
    () => (
      <View style={[styles.loadingOverlay]}>
        <ActivityIndicator size="large" color="red" />
      </View>
    ),
    []
  );

  return (
    <WebView
      containerStyle={{ height: dimensions.height, width: dimensions.width }}
      style={{
        backgroundColor: "transparent",
        width: "100%",
        pointerEvents: "auto",
      }}
      source={{ html }}
      originWhitelist={["*"]}
      onShouldStartLoadWithRequest={(event: any) => {
        if (event.url.slice(0, 24) === "https://www.hcaptcha.com") {
          Linking.openURL(event.url);
          return false;
        }
        return true;
      }}
      mixedContentMode={"always"}
      javaScriptEnabled
      automaticallyAdjustContentInsets
      renderLoading={renderLoading}
      startInLoadingState={true}
      injectedJavaScript={patchPostMessageJsCode}
      onMessage={(e: any) => {
        const data = e.nativeEvent.data;
        if (!data) return;
        if (typeof data !== "string") return;

        try {
          const parsedData = JSON.parse(data);
          if (parsedData.source === "hcaptcha") {
            onMessage(parsedData.payload);
          }
        } catch {}
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  loadingOverlay: {
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
});

export default HCaptcha;
