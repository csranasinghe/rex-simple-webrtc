import { WebrtcConnectorModule } from './webrtc-connector.module';

describe('WebrtcConnectorModule', () => {
  let webrtcConnectorModule: WebrtcConnectorModule;

  beforeEach(() => {
    webrtcConnectorModule = new WebrtcConnectorModule();
  });

  it('should create an instance', () => {
    expect(webrtcConnectorModule).toBeTruthy();
  });
});
