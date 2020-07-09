/* eslint-disable */

function createFolder(name) {
  cy.get('#addFolder').click();
  const input = cy.get('input[type="text"]');
  input.should('have.attr', 'placeholder', 'new folder');
  input.type(name);
  cy.contains('Accept').click();
  cy.contains(name);
}

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
    createFolder('Folder-test');
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

  it('has parent folder item', () => {
    cy.contains('. . /').should('have.length', 1);
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
    const input = cy.get('input[type="text"]');
    // input
    //   .should('have.attr', 'value')
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

    cy.visit('http://localhost:3000/');
  });

  it('can add multiple files', () => {
    cy.contains('Folder-renamed').click();

    cy.get('#fileUpload').attachFile('pic2.jpg').attachFile('pic3.jpg');
    cy.contains('pic2.jpg');
    cy.contains('pic3.jpg');
    cy.wait(1000);
  });

  it('can preview photos', () => {
    cy.contains('pic2.jpg').click();
    cy.get('img').should('have.length', 1);
  });

  it('can create and share a photo gallery folder', () => {
    cy.contains('. . /').click();
    cy.contains('Folder-renamed').trigger('mouseover');
    cy.get('#Share-dir').click();
    cy.get('#shareType-image').click();

    const input = cy.get('input[type="text"]');
    input.invoke('val').then((url) => {
      expect(url).to.match(/image/);
      cy.visit(url);
      cy.contains('Download now');
      cy.get('.imageGalleryBlock').should('have.length', 3);
    });
  });

  it('gallery images open big', () => {
    cy.get('.imageGalleryBlock').first().click();
    cy.get('.ril-image-current');
    cy.get('.ril-close').click();
    cy.visit('http://localhost:3000/');
  });

  it('instance panel opens', () => {
    cy.contains('Instances').click();
    cy.contains('main');
  });

  it('can create instance', () => {
    cy.contains('Create instance').click();
    const input = cy.get('input[type="text"]');
    input.should('have.attr', 'placeholder', 'instance name');
    input.type('Instance #2');
    cy.contains('Accept').click();
    cy.contains('Instance #2');
  });

  it('should not have any files on fresh instance', () => {
    cy.contains('Files').click();
    cy.contains('drag files to upload');
  });

  it('instance selector switches instance', () => {
    cy.contains('Instance #2').click();
    cy.contains('main').click();
    cy.contains('Folder-renamed');
  });

  it('upload encrypted file', () => {
    cy.get('#togglePassword').click();
    const input = cy.get('input[placeholder="secure password"]');
    input.type('password1234');
    cy.contains('Accept').click();

    cy.get('#fileUpload').attachFile('pic1.jpg');
    cy.contains('pic1.jpg');
    cy.get('.fileItemEncrypted').should('have.length', 1);
    cy.get('#togglePassword').click();
  });

  it('download encrypted file', () => {
    cy.contains('pic1.jpg').trigger('mouseover');
    cy.get('#Download-file').click();
    const input = cy.get('input[placeholder="password"]');
    input.type('password1234');
    cy.contains('Accept').click();
    cy.contains('Accept').should('have.length', 0);
  });

  it('delete file', () => {
    cy.contains('pic1.jpg').trigger('mouseover');
    cy.get('#Delete-file').click();
    cy.contains('pic1.jpg').should('have.length', 0);
  });

  // it('can move folders into folders', ()=> {
  //   cy.wait(1000);
  //
  //   createFolder('newParentFolder');
  //
  //   const dragFolder = cy.get(".fileItem :last-child");
  //   dragFolder.drag('.fileItem :first-child', {force: true});
  // });
});
