/* eslint-disable */
const rootURL = 'http://localhost:3000/';
// const rootURL = 'https://alpha.sailplane.io/';

function createFolder(name) {
  cy.get('#addFolder').click();
  const input = cy.get('input[type="text"]');
  input.should('have.attr', 'placeholder', 'folder name');
  input.type(name);
  cy.contains('Accept').click();
  cy.contains(name);
}

describe('Fresh app private drive', () => {
  before(() => {
    window.indexedDB.databases().then((r) => {
      for (var i = 0; i < r.length; i++)
        window.indexedDB.deleteDatabase(r[i].name);
    });
  });

  beforeEach(() => {
    cy.restoreLocalStorageCache();
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  it('shows loading', () => {
    cy.visit(rootURL);

    cy.contains('Loading...');
    cy.wait(5000)
  });

  it('shows intro screen on first load', () => {
    cy.contains('Open drive').click();
  });

  it('eventually shows the drag text', () => {
    cy.contains('Drag files to upload or click here');
  });

  it('root folder does not have share button', () => {
    cy.get('#folderShare').should('have.length', 0);
  });

  it('creates a new folder', () => {
    createFolder('Folder-test');
  });

  it('can rename a folder', () => {
    cy.contains('Folder-test').trigger('mouseenter');
    cy.get('#Rename-dir').click();
    const input = cy.get('input[type="text"]');
    input.should('have.attr', 'value', 'Folder-test');
    input.type('Folder-renamed');
    cy.contains('Accept').click();
    cy.contains('Folder-renamed');
  });

  it('can open a folder', () => {
    cy.contains('Folder-renamed').click();
    cy.contains('Drag files to upload or click here');
  });

  it('has parent folder item', () => {
    cy.contains('. . /').should('have.length', 1);
  });

  it('has share folder button', () => {
    cy.get('#folderShare').should('have.length', 1);
  });

  it('can upload a file', () => {
    const file = 'pic1.jpg';
    cy.get('#fileUpload').attachFile(file);
    cy.contains('pic1.jpg');
  });

  it('file has correct size', () => {
    cy.contains('79.8 kB');
  });

  it('can rename file', () => {
    cy.contains('pic1.jpg').trigger('mouseenter');

    cy.get('#Rename-file').click();
    const input = cy.get('input[type="text"]');
    input.should('have.attr', 'value', 'pic1.jpg');
    input.type('pic1-renamed.jpg');
    cy.contains('Accept').click();
    cy.contains('pic1-renamed.jpg');
  });

  it('has tooltips on every icon', () => {
    const toolTips = ['Download', 'Rename', 'Share', 'Delete'];
    cy.contains('pic1-renamed.jpg').trigger('mouseenter');
    for (let toolTip of toolTips) {
      cy.get(`#${toolTip}-file`).trigger('mouseenter');
      cy.contains(toolTip);
    }
  });

  it('can share file', () => {
    cy.contains('pic1-renamed.jpg').trigger('mouseenter');
    cy.get('#Share-file').click();
    cy.contains('Share options');
    const input = cy.get('input[type="text"]');
  });

  it('can open a share link', () => {
    const input = cy.get('input[type="text"]');
    input.invoke('val').then((url) => {
      expect(url).to.match(/default/);
      cy.visit(url);
      cy.contains('Download now');
      cy.contains('79.8 kB');
    });
  });

  it('should have an preview image', () => {
    cy.get('img').should('have.length', 2);

    cy.visit(rootURL);
  });

  it('can add multiple files', () => {
    cy.contains('Folder-renamed').click();

    cy.get('#fileUpload').attachFile('pic2.jpg').attachFile('pic3.jpg');
    cy.contains('pic2.jpg');
    cy.contains('pic3.jpg');
  });

  it('can preview photos', () => {
    cy.contains('pic2.jpg').click();
    cy.get('img').should('have.length', 4);
    cy.get('.ril-close').click();
  });

  it('cannot share encrypted folder', () => {
    cy.contains('. . /').click();
    cy.contains('Folder-renamed').trigger('mouseenter');
    cy.get('#Share-dir').trigger('mouseenter');
    cy.contains('No encrypted folder sharing');
  });

  it('drive panel opens', () => {
    cy.contains('Drives').click();
    cy.get('.drive').should('have.length', 1);
  });

  // it('can copy drive address', () => {
  //   cy.window().then((win) => {
  //     cy.stub(win.navigator.clipboard, 'writeText')
  //       .resolves(true)
  //       .as('writeText');
  //   });
  //
  //   cy.get('.instanceAddressCopy').click();
  //
  //   cy.get('@writeText').should('be.calledWithMatch', /^\/orbitdb/);
  // });

  it('can create a public drive', () => {
    cy.contains('Create drive').click();
    cy.contains('Create public drive').click();
    cy.get('.drive').should('have.length', 2);
    cy.contains('private').should('have.length', 1);
    cy.contains('public').should('have.length', 1);
  });

  it('should not have any files on fresh drive', () => {
    cy.contains('Files').click();
    cy.contains('Drag files to upload or click here');
  });

  it('drive selector switches drive', () => {
    cy.get('#currentInstanceSelector').click();
    cy.get('.smallInstanceItem').click();
    cy.contains('Folder-renamed');
  });

  it('can delete drive', () => {
    cy.contains('Drives').click();
    cy.get('.instanceDelete').last().click();
    cy.get('.drive').should('have.length', 1);
    cy.contains('Files').click();
  });

  it('context menu rename works', () => {
    cy.contains('Folder-renamed').trigger('contextmenu');
    cy.contains('Rename').click();
    const input = cy.get('input[type="text"]');
    input.should('have.attr', 'value', 'Folder-renamed');
    input.type('Folder');
    cy.contains('Accept').click();
    cy.contains('Accept').should('have.length', 0);
  });
});
