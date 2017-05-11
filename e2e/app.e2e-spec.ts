import { BlueprintPage } from './app.po';

describe('blueprint App', () => {
  let page: BlueprintPage;

  beforeEach(() => {
    page = new BlueprintPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
