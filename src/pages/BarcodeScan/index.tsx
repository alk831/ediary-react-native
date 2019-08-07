import React, { PureComponent, createRef } from 'react';
import { RNCamera, RNCameraProps, TakePictureResponse } from 'react-native-camera';
import styled from 'styled-components/native';
import { NavigationScreenProps } from 'react-navigation';
import { BarcodeId } from '../../types';
import { Theme } from '../../common/theme';

interface BarcodeScanProps extends NavigationScreenProps<BarcodeScanParams, BarcodeScanNavigationOptions> {}
export class BarcodeScan extends PureComponent {

  static navigationOptions: BarcodeScanProps['navigationOptions'] = {
    title: 'Zeskanuj kod kreskowy'
  }

  camera = createRef<RNCamera>();
  onBarcodeDetected: BarcodeScanParams['onBarcodeDetected'];
  onPhotoTaken: BarcodeScanParams['onPhotoTaken'];

  constructor(props: BarcodeScanProps) {
    super(props);
    this.onBarcodeDetected = props.navigation.getParam('onBarcodeDetected');
    this.onPhotoTaken = props.navigation.getParam('onPhotoTaken');
  }


  takePicture = async () => {
    if (this.camera.current && this.onPhotoTaken) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.current.takePictureAsync(options);
      this.onPhotoTaken(data);
    }
  }

  handleGoogleBarcodeDetection: RNCameraProps['onGoogleVisionBarcodesDetected'] = ({ barcodes }) => {
    const [barcode] = barcodes.filter(barcode => barcode.type === 'ISBN');
    if (barcode && this.onBarcodeDetected) {
      this.onBarcodeDetected(barcode.data);
    }
  }

  handleBarcodeDetection: RNCameraProps['onBarCodeRead'] = (barcode) => {
    if (this.onBarcodeDetected) {
      this.onBarcodeDetected(barcode.data);
    }
  }

  render() {
    return (
      <Container>
        <StyledCamera
          ref={this.camera}
          type="back"
          flashMode="auto"
          androidCameraPermissionOptions={{
            title: 'Uprawnienia kamery',
            message: 'Potrzebuję uprawnień kamery do zeskanowania kodu kreskowego',
            buttonPositive: 'Ok',
            buttonNegative: 'Anuluj',
          }}
          onBarCodeRead={this.onBarcodeDetected && this.handleBarcodeDetection}
          onGoogleVisionBarcodesDetected={this.onBarcodeDetected && this.handleGoogleBarcodeDetection}
          onTextRecognized={null as any}
          onFacesDetected={null as any}
          captureAudio={false}
        />
        {this.onPhotoTaken && (
          <PhotoButton onPress={this.takePicture}>
            <PhotoTitle>Zrób zdjęcie</PhotoTitle>
          </PhotoButton>
        )}
      </Container>
    );
  }


}

const Container = styled.View`
  background-color: black;
  justify-content: center;
  flex: 1;
`

const StyledCamera = styled(RNCamera)`
  flex: 1;
`

const PhotoButton = styled.TouchableOpacity`
  background: #fff;
`

const PhotoTitle = styled.Text<{
  theme: Theme
}>`
  font-family: ${props => props.theme.fontFamily};
  padding: 15px;
  border-radius: 5px;
  text-align: center;
`

export interface BarcodeScanParams {
  onBarcodeDetected?: (barcode: BarcodeId) => void
  onPhotoTaken?: (data: TakePictureResponse) => void
}

interface BarcodeScanNavigationOptions {
  title: string
}