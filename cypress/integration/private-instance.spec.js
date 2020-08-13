/* eslint-disable */
const rootURL = 'http://localhost:3000/';
// const rootURL = 'https://alpha.sailplane.io/';


describe('Private drive management', () => {
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
    cy.clearLocalStorageCache();

    cy.visit(rootURL);

    cy.contains('Loading...');
    // cy.wait(5000)
  });

  it('shows intro screen on first load', () => {
    cy.contains('Open drive').click();
  });

  it('eventually shows the drag text', () => {
    cy.contains('Drag files to upload or click here');
  });

  it('drive panel opens', () => {
    cy.contains('Drives').click();
    cy.get('.drive').should('have.length', 1);
  });

  it('can nickname a drive', () => {
    cy.get('.drive').first().trigger('mouseenter');
    cy.get('.instanceLabel').first().click();

    const input = cy.get('input[type="text"]');
    input.should('have.attr', 'placeholder', '(ex: Work sketches)');
    input.type('Cool folder name');
    cy.contains('Confirm').click();
    cy.contains('Cool folder name')
  });

  it('can create a private drive', () => {
    cy.contains('Create drive').click();
    cy.contains('Create private drive').click();
    cy.get('.drive').should('have.length', 2);
  });

  it('can nickname a 2nd drive', () => {
    cy.get('.drive').last().trigger('mouseenter');
    cy.get('.instanceLabel').last().click();

    const input = cy.get('input[type="text"]');
    input.should('have.attr', 'placeholder', '(ex: Work sketches)');
    input.type('Test drive 2');
    cy.contains('Confirm').click();
    cy.contains('Test drive 2')
  });

  it('can switch drives', () => {
    cy.contains('Cool folder name').click();
  });

  it('can open drive access panel', () => {
    cy.get('.instanceAccess').first().click();
    cy.contains('permissions for Cool folder name');
  });

  it('should error if invalid writer key', () => {
    cy.contains('Add writer').click();
    const input = cy.get('input[type="text"]');
    input.should('have.attr', 'placeholder', 'user id');
    input.type('notapublickey');
    cy.contains('Add writer').click();
    cy.contains('Invalid user ID!');
    cy.contains('Cancel').click();
  });

  it('should add valid writer key', () => {
    cy.contains('Add writer').click();
    const input = cy.get('input[type="text"]');
    input.should('have.attr', 'placeholder', 'user id');
    input.type('037f957ecde47e2b0dede1665d2478c32f706e66c7cb5aed19c4783eccdf482dda');
    cy.contains('Add writer').click();
    cy.contains('037f957ecd');
  });

  it('should error if invalid reader key', () => {
    cy.contains('Add reader').click();
    const input = cy.get('input[type="text"]');
    input.should('have.attr', 'placeholder', 'user id');
    input.type('notapublickey');
    cy.contains('Add reader').click();
    cy.contains('Invalid user ID!');
    cy.contains('Cancel').click();
  });

  it('should add valid reader key', () => {
    cy.contains('Add reader').click();
    const input = cy.get('input[type="text"]');
    input.should('have.attr', 'placeholder', 'user id');
    input.type('03412560381bf152f9b1e1bbd014ed26df8b8512eda2b1a9328cd162d349e1f55b');
    cy.contains('Add reader').click();
    cy.contains('0341256');
    cy.get('.dialogClose').click();
  });
});
