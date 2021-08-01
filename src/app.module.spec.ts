import { AppModule } from './app.module';

describe('create app module', () => {
  let module: AppModule;

  beforeEach(() => {
    module = new AppModule();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });
});
