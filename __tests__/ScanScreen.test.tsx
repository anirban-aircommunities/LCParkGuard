/**
 * Functional tests for ScanScreen: UI flows, validation branching, and action buttons.
 * The scan view model and plate recognition are stubbed so tests stay offline (no HTTP).
 */

import React from 'react';
import { Alert } from 'react-native';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import ScanScreen from '../src/screens/ScanScreen';
import { useScanViewModel } from '../src/viewmodels/ScanViewModel';
import { useDispatch } from 'react-redux';
import {
  recognizePlate,
  PlateRecognizerResponse,
} from '../src/screens/plateRecognizer/plateRecognizer';
import type { Vehicle } from '../src/models/Vehicle';

jest.mock('../src/redux/slices/scanHistorySlice', () => ({
  addScanHistory: jest.fn((payload) => ({
    type: 'scanHistory/addScanHistory',
    payload,
  })),
}));

jest.mock('../src/redux/slices/towingQueueSlice', () => ({
  addToTowingQueue: jest.fn((payload) => ({
    type: 'towingQueue/addToTowingQueue',
    payload,
  })),
}));

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('../src/viewmodels/ScanViewModel', () => ({
  useScanViewModel: jest.fn(),
}));

jest.mock('../src/screens/plateRecognizer/plateRecognizer', () => ({
  recognizePlate: jest.fn(),
}));

const mockTakePhoto = jest.fn().mockResolvedValue({ path: 'mock-photo.jpg' });

jest.mock('react-native-vision-camera', () => {
  const React = require('react');
  const { View } = require('react-native');
  const Camera = React.forwardRef((props: object, ref: React.Ref<unknown>) => {
    React.useImperativeHandle(ref, () => ({
      takePhoto: mockTakePhoto,
    }));
    return <View testID="mock-camera" {...props} />;
  });
  Camera.requestCameraPermission = jest.fn(() => Promise.resolve('granted'));
  return {
    Camera,
    useCameraDevice: jest.fn(() => ({ id: 'back', name: 'Back Camera' })),
  };
});

const mockedUseScanViewModel = useScanViewModel as jest.MockedFunction<
  typeof useScanViewModel
>;
const mockedUseDispatch = useDispatch as jest.MockedFunction<
  typeof useDispatch
>;
const mockedRecognizePlate = recognizePlate as jest.MockedFunction<
  typeof recognizePlate
>;

const propertyA = {
  id: 'p1',
  name: 'Sunset Plaza',
  address: '1 Main St',
  towingCompany: 'QuickTow',
  towingPhone: '555-0100',
};

const propertyB = {
  id: 'p2',
  name: 'Harbor Lot',
  address: '2 Dock Rd',
  towingCompany: 'HarborTow',
  towingPhone: '555-0200',
};

const platePlaceholder = 'ENTER PLATE NUMBER (E.G., ABC-1234)';

function plateResponse(
  overrides: Partial<PlateRecognizerResponse>
): PlateRecognizerResponse {
  return {
    processing_time: 0,
    results: [],
    filename: 'test.jpg',
    version: 1,
    timestamp: new Date().toISOString(),
    ...overrides,
  };
}

function vehicle(overrides: Partial<Vehicle>): Vehicle {
  return {
    id: 'v1',
    licensePlate: 'TEST',
    parkingSpot: 'A-1',
    propertyId: 'p1',
    status: 'registered',
    scannedAt: new Date().toISOString(),
    ...overrides,
  };
}

function defaultViewModel(
  overrides: Partial<ReturnType<typeof useScanViewModel>> = {}
) {
  return {
    properties: [propertyA, propertyB],
    selectedProperty: propertyA,
    selectProperty: jest.fn(),
    checkVehicle: jest.fn(),
    loading: false,
    currentVehicle: null,
    clearCurrentVehicle: jest.fn(),
    sendToTowingQueue: jest.fn(),
    ...overrides,
  } as ReturnType<typeof useScanViewModel>;
}

describe('ScanScreen', () => {
  let mockDispatch: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDispatch = jest.fn();
    mockedUseDispatch.mockReturnValue(mockDispatch);
    mockedUseScanViewModel.mockImplementation(() => defaultViewModel());
    mockedRecognizePlate.mockResolvedValue(plateResponse({ results: [] }));
  });

  it('renders property selection and expandable towing info card', () => {
    const { getByText, getAllByText } = render(<ScanScreen />);

    expect(getByText('Property Selection')).toBeTruthy();
    expect(getAllByText('Sunset Plaza').length).toBeGreaterThanOrEqual(1);
    expect(getByText('1 Main St')).toBeTruthy();
    expect(getByText('Towing Company Info')).toBeTruthy();
    expect(getByText(/QuickTow/)).toBeTruthy();
  });

  it('opens the property dropdown and selects another property', async () => {
    const selectProperty = jest.fn();
    mockedUseScanViewModel.mockImplementation(() =>
      defaultViewModel({ selectProperty })
    );

    const { getByText, getAllByText } = render(<ScanScreen />);

    fireEvent.press(getAllByText('Sunset Plaza')[0]);

    await waitFor(() => {
      expect(getByText('Harbor Lot')).toBeTruthy();
    });

    fireEvent.press(getByText('Harbor Lot'));

    expect(selectProperty).toHaveBeenCalledWith(propertyB);
  });

  it('shows Manual tab by default with license plate input', () => {
    const { getByText, getByPlaceholderText } = render(<ScanScreen />);

    expect(getByText('Manual')).toBeTruthy();
    expect(getByText('License Plate Number')).toBeTruthy();
    expect(getByPlaceholderText(platePlaceholder)).toBeTruthy();
  });

  it('switches to Scan tab', () => {
    const { getByText } = render(<ScanScreen />);

    fireEvent.press(getByText('Scan'));

    expect(getByText('Start Scan')).toBeTruthy();
  });

  it('calls checkVehicle when Check Vehicle is pressed with plate and property', () => {
    const checkVehicle = jest.fn();
    mockedUseScanViewModel.mockImplementation(() =>
      defaultViewModel({ checkVehicle })
    );

    const { getByText, getByPlaceholderText } = render(<ScanScreen />);

    fireEvent.changeText(getByPlaceholderText(platePlaceholder), 'abc123');
    fireEvent.press(getByText('Check Vehicle'));

    expect(checkVehicle).toHaveBeenCalledWith('abc123', '');
  });

  it('hides Check Vehicle button while loading', () => {
    mockedUseScanViewModel.mockImplementation(() =>
      defaultViewModel({ loading: true })
    );

    const { queryByText, getByPlaceholderText } = render(<ScanScreen />);

    fireEvent.changeText(getByPlaceholderText(platePlaceholder), 'abc123');

    expect(queryByText('Check Vehicle')).toBeNull();
  });

  it('shows verification actions for unregistered vehicle after check', () => {
    mockedUseScanViewModel.mockImplementation(() =>
      defaultViewModel({
        currentVehicle: vehicle({
          licensePlate: 'BAD1',
          parkingSpot: 'A-1',
          status: 'unregistered',
        }),
      })
    );

    const { getByText, getByPlaceholderText } = render(<ScanScreen />);

    fireEvent.changeText(getByPlaceholderText(platePlaceholder), 'BAD1');

    expect(getByText("We don't recognize this license plate.")).toBeTruthy();
    expect(getByText('OK')).toBeTruthy();
    expect(getByText('Text Resident')).toBeTruthy();
    expect(getByText('Send to Towing Queue')).toBeTruthy();
  });

  it('opens Text Resident modal when Text Resident is pressed', () => {
    mockedUseScanViewModel.mockImplementation(() =>
      defaultViewModel({
        currentVehicle: vehicle({
          licensePlate: 'BAD1',
          parkingSpot: 'A-1',
          status: 'unregistered',
        }),
      })
    );

    const { getByText, getByPlaceholderText, getAllByText } = render(
      <ScanScreen />
    );

    fireEvent.changeText(getByPlaceholderText(platePlaceholder), 'BAD1');
    fireEvent.press(getByText('Text Resident'));

    expect(getAllByText('Text Resident').length).toBeGreaterThanOrEqual(2);
    expect(getByText('Resident Name')).toBeTruthy();
    expect(getByText('Send Text')).toBeTruthy();
    expect(getByText('Parked in ADA')).toBeTruthy();
  });

  it('dispatches addToTowingQueue when Send to Towing Queue is pressed', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert');

    mockedUseScanViewModel.mockImplementation(() =>
      defaultViewModel({
        currentVehicle: vehicle({
          licensePlate: 'BAD1',
          parkingSpot: 'A-1',
          status: 'unregistered',
        }),
      })
    );

    const { getByText, getByPlaceholderText } = render(<ScanScreen />);

    fireEvent.changeText(getByPlaceholderText(platePlaceholder), 'BAD1');
    fireEvent.press(getByText('Send to Towing Queue'));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'towingQueue/addToTowingQueue' })
      );
    });

    expect(alertSpy).toHaveBeenCalledWith(
      'Success',
      'Added in queue',
      expect.any(Array)
    );

    alertSpy.mockRestore();
  });

  it('shows OK for authorized vehicle verification', () => {
    mockedUseScanViewModel.mockImplementation(() =>
      defaultViewModel({
        currentVehicle: vehicle({
          licensePlate: 'GOOD1',
          parkingSpot: 'A-2',
          status: 'registered',
        }),
      })
    );

    const { getByText, getByPlaceholderText } = render(<ScanScreen />);

    fireEvent.changeText(getByPlaceholderText(platePlaceholder), 'GOOD1');

    expect(
      getByText('This vehicle is authorized for this property.')
    ).toBeTruthy();
    expect(getByText('OK')).toBeTruthy();
  });

  it('calls clearCurrentVehicle when OK is pressed', () => {
    const clearCurrentVehicle = jest.fn();
    mockedUseScanViewModel.mockImplementation(() =>
      defaultViewModel({
        clearCurrentVehicle,
        currentVehicle: vehicle({
          licensePlate: 'GOOD1',
          parkingSpot: 'A-2',
          status: 'registered',
        }),
      })
    );

    const { getByText, getByPlaceholderText } = render(<ScanScreen />);

    fireEvent.changeText(getByPlaceholderText(platePlaceholder), 'GOOD1');
    fireEvent.press(getByText('OK'));

    expect(clearCurrentVehicle).toHaveBeenCalled();
  });

  it('collapses and expands towing company info', () => {
    const { getByText, queryByText } = render(<ScanScreen />);

    expect(getByText(/555-0100/)).toBeTruthy();

    fireEvent.press(getByText('Towing Company Info'));

    expect(queryByText(/555-0100/)).toBeNull();

    fireEvent.press(getByText('Towing Company Info'));

    expect(getByText(/555-0100/)).toBeTruthy();
  });

  it('after scan capture with a detected plate, checkVehicle receives the plate', async () => {
    const checkVehicle = jest.fn();
    mockedUseScanViewModel.mockImplementation(() =>
      defaultViewModel({ checkVehicle })
    );

    mockedRecognizePlate.mockResolvedValue(
      plateResponse({
        results: [{ plate: 'abc123', score: 0.95 }],
      })
    );

    const { getByText, getByTestId, getByDisplayValue } = render(
      <ScanScreen />
    );

    fireEvent.press(getByText('Scan'));

    await waitFor(() => {
      expect(getByText('Start Scan')).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(getByText('Start Scan'));
    });

    await waitFor(() => {
      expect(getByTestId('scan-capture-button')).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(getByTestId('scan-capture-button'));
    });

    await waitFor(() => {
      expect(getByDisplayValue('ABC123')).toBeTruthy();
    });

    fireEvent.press(getByText('Check Vehicle'));

    expect(checkVehicle).toHaveBeenCalledWith('ABC123', '');
  });

  it('alerts when capture finds no plate', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    mockedRecognizePlate.mockResolvedValue(plateResponse({ results: [] }));

    const { getByText, getByTestId } = render(<ScanScreen />);

    fireEvent.press(getByText('Scan'));

    await waitFor(() => {
      expect(getByText('Start Scan')).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(getByText('Start Scan'));
    });

    await waitFor(() => {
      expect(getByTestId('scan-capture-button')).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(getByTestId('scan-capture-button'));
    });

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        'No Plate Found',
        'Could not detect a license plate in the image. Please try again.'
      );
    });

    alertSpy.mockRestore();
  });
});
