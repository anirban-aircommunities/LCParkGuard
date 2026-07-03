import {Platform} from 'react-native';

const API_KEY = '9ea28314c45892e8454cd2c22222ef65cc81bf41';
const API_URL = 'https://api.platerecognizer.com/v1/plate-reader/';

export interface PlateResult {
  plate: string;
  region?: {
    code: string;
    score: number;
  };
  vehicle?: {
    type: string;
    make?: Array<{make: string; score: number}>;
    model?: Array<{model: string; score: number}>;
    color?: Array<{color: string; score: number}>;
  };
  orientation?: string;
  direction?: number;
  score: number;
  box?: {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
  };
}

export interface PlateRecognizerResponse {
  processing_time: number;
  results: PlateResult[];
  filename: string;
  version: number;
  camera_id?: string;
  timestamp: string;
}

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const body = await response.json();
    return body.detail || body.message || `HTTP ${response.status}`;
  } catch {
    return `HTTP ${response.status}`;
  }
}

export const recognizePlate = async (
  imageUri: string,
): Promise<PlateRecognizerResponse> => {
  const formData = new FormData();

  const uri = imageUri.startsWith('file://')
    ? Platform.OS === 'ios'
      ? imageUri.replace('file://', '')
      : imageUri
    : imageUri;

  formData.append('upload', {
    uri: uri,
    type: 'image/jpeg',
    name: 'plate.jpg',
  } as any);

  formData.append('mmc', 'true');
  formData.append('regions', 'us');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Token ${API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(await parseErrorMessage(response));
    }

    const plateData = (await response.json()) as PlateRecognizerResponse;

    if (plateData.results && plateData.results.length > 0) {
      console.log('[API_RESPONSE] PLATE:', plateData.results[0].plate);
    } else {
      console.warn('[PlateRecognizer API] No plate detected in response');
    }

    return plateData;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to recognize license plate';
    throw new Error(message);
  }
};
