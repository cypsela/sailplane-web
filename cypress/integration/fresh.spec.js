/* eslint-disable */

describe('App loads', () => {
  it('shows loading and eventually the drag text', () => {
    window.indexedDB.databases().then((r) => {
      for (var i = 0; i < r.length; i++)
        window.indexedDB.deleteDatabase(r[i].name);
    });

    cy.visit('http://localhost:3000/');

    cy.contains('Loading...');
    cy.wait(5000);
    cy.contains('drag files to upload');
  });

  it('creates a new folder', () => {
    cy.get('#addFolder').click();
    const input = cy.get('input[type="text"]');
    input.should('have.attr', 'placeholder', 'new folder');
    input.type('Folder-test');
    cy.contains('Accept').click();
    cy.contains('Folder-test');
  });

  it('can rename a folder', () => {
    cy.contains('Folder-test').trigger('mouseover');
    cy.get('#Edit-dir').click();
    const input = cy.get('input[type="text"]');
    input.should('have.attr', 'value', 'Folder-test');
    input.type('Folder-renamed');
    cy.contains('Accept').click();
    cy.contains('Folder-renamed');
  });

  it('can open a folder', () => {
    cy.contains('Folder-renamed').click();
    cy.contains('drag files to upload');
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
    cy.contains('pic1.jpg').trigger('mouseover');

    cy.get('#Edit-file').click();
    const input = cy.get('input[type="text"]');
    input.should('have.attr', 'value', 'pic1.jpg');
    input.type('pic1-renamed.jpg');
    cy.contains('Accept').click();
    cy.contains('pic1-renamed.jpg');
  });

  it('can share file', () => {
    cy.contains('pic1-renamed.jpg').trigger('mouseover');
    cy.get('#Share-file').click();
    cy.contains('Share options');
    // const input = cy.get('input[type="text"]');
    // input.should('have.attr', 'value')
    //   .and('match', /QmXETG1AE738nUSFNgFMFhujUugKZyWNTqvZTZJB14TFVg/);
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

  it('can create and share a photo gallery folder', () => {
    cy.visit('http://localhost:3000/');
  });

  // it('has parent folder item', () => {
  //   cy.contains('. . /').click();
  // });
});
