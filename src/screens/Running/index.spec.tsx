import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { RunningScreen } from './';
import Geolocation, { GeolocationResponse } from '@react-native-community/geolocation';

describe('<RunningScreen />', () => {

  it('should increment training duration', () => {
    jest.useFakeTimers();
    const ctx = render(<RunningScreen />);

    const trainingDurationText = ctx.getByLabelText('Czas trwania treningu');
    jest.advanceTimersByTime(1000);

    expect(trainingDurationText).toEqual('00:00:01');
  });

  it('should pause training when clicked on pause a button', () => {
    jest.useFakeTimers();
    const ctx = render(<RunningScreen />);

    const pauseTrainingButton = ctx.getByLabelText('Zatrzymaj/kontynuuj trening');

    fireEvent.pressIn(pauseTrainingButton);
    jest.advanceTimersByTime(500);

  });

  it('should calculate correct session distance', () => {
    const geoLocationMock = jest.spyOn(Geolocation, 'watchPosition')
      .mockImplementationOnce(success => {
        success({
          timestamp: 1,
          coords: {
            longitude: 10000,
            latitude: 10000,
          }
        } as GeolocationResponse)
        const watchId = 1;
        return watchId;
      })
    const ctx = render(<RunningScreen />);
    
    const trainingDistanceText = ctx.findByLabelText('Przebyty dystans');

    expect(geoLocationMock).toHaveBeenCalledTimes(1);
    expect(trainingDistanceText).not.toEqual('0.00');
  });

});