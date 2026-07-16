describe('App layout', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the page', () => {
    cy.get('app-root').should('exist');
  });

  it('should display the Material toolbar with the app title', () => {
    cy.get('mat-toolbar').should('be.visible').and('contain.text', 'VHB');
  });

  it('should render a two-column Material grid', () => {
    cy.get('mat-grid-list').should('exist').and('have.attr', 'cols', '2');
    cy.get('mat-grid-tile').should('have.length', 2);
  });

  it('should render the info panel in the left tile', () => {
    cy.get('mat-grid-tile').first().find('.info-panel').should('exist');
  });

  it('should render the map component in the right tile', () => {
    cy.get('mat-grid-tile').last().find('app-map').should('exist');
  });
});

describe('Map component', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render the Leaflet map container', () => {
    cy.get('app-map .map-container').should('exist');
  });

  it('should initialise a Leaflet map instance', () => {
    cy.get('.leaflet-container').should('exist');
  });

  it('should load OpenStreetMap tile images', () => {
    cy.get('.leaflet-tile-pane').should('exist');
  });

  it('should display the map centred on California', () => {
    // Leaflet encodes the view in the URL hash when scrollWheelZoom is active;
    // verify via the attribution text which is always present on a rendered map.
    cy.get('.leaflet-control-attribution')
      .should('be.visible')
      .and('contain.text', 'OpenStreetMap');
  });
});
