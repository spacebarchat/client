import qs, {ParsedQs} from 'qs';
import {Platform} from 'react-native';

const isDOMAvailable =
  // @ts-ignore
  typeof window !== 'undefined' && !!window.document?.createElement;

type QueryParams = ParsedQs;

type CreateURLOptions = {
  /**
   * URI protocol `<scheme>://` that must be built into your native app.
   */
  scheme?: string;
  /**
   * An object of parameters that will be converted into a query string.
   */
  queryParams?: QueryParams;
  /**
   * Should the URI be triple slashed `scheme:///path` or double slashed `scheme://path`.
   */
  isTripleSlashed?: boolean;
};

function ensureTrailingSlash(input: string, shouldAppend: boolean): string {
  const hasSlash = input.endsWith('/');
  if (hasSlash && !shouldAppend) {
    return input.substring(0, input.length - 1);
  } else if (!hasSlash && shouldAppend) {
    return `${input}/`;
  }
  return input;
}

function ensureLeadingSlash(input: string, shouldAppend: boolean): string {
  const hasSlash = input.startsWith('/');
  if (hasSlash && !shouldAppend) {
    return input.substring(1);
  } else if (!hasSlash && shouldAppend) {
    return `/${input}`;
  }
  return input;
}

export function createURL(
  path: string,
  {queryParams = {}, isTripleSlashed = false}: CreateURLOptions = {},
): string {
  if (Platform.OS === 'web') {
    if (!isDOMAvailable) {
      return '';
    }

    // @ts-ignore
    const origin = ensureTrailingSlash(window.location.origin, false);
    let queryString = qs.stringify(queryParams);
    if (queryString) {
      queryString = `?${queryString}`;
    }

    let outputPath = path;
    if (outputPath) {
      outputPath = ensureLeadingSlash(path, true);
    }

    return encodeURI(`${origin}${outputPath}${queryString}`);
  }

  //   const resolvedScheme = resolveScheme({scheme});
  const resolvedScheme = 'fosscord';

  let hostUri = '';

  //   if (hasCustomScheme() && isExpoHosted()) {
  //     hostUri = '';
  //   }

  if (path) {
    // if (isExpoHosted() && hostUri) {
    //   path = `/--/${removeLeadingSlash(path)}`;
    // }
    if (isTripleSlashed && !path.startsWith('/')) {
      path = `/${path}`;
    }
  } else {
    path = '';
  }

  // merge user-provided query params with any that were already in the hostUri
  // e.g. release-channel
  let queryString = '';
  const queryStringMatchResult = hostUri.match(/(.*)\?(.+)/);
  if (queryStringMatchResult) {
    hostUri = queryStringMatchResult[1];
    queryString = queryStringMatchResult[2];
    let paramsFromHostUri = {};
    try {
      const parsedParams = qs.parse(queryString);
      if (typeof parsedParams === 'object') {
        paramsFromHostUri = parsedParams;
      }
    } catch {}
    queryParams = {
      ...queryParams,
      ...paramsFromHostUri,
    };
  }
  queryString = qs.stringify(queryParams);
  if (queryString) {
    queryString = `?${queryString}`;
  }

  hostUri = ensureLeadingSlash(hostUri, !isTripleSlashed);

  return encodeURI(
    `${resolvedScheme}:${
      isTripleSlashed ? '/' : ''
    }/${hostUri}${path}${queryString}`,
  );
}
