import { test, expect } from '@playwright/test';

test.describe('App layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the page', async ({ page }) => {
    await expect(page.locator('app-root')).toBeAttached();
  });

  test('should display the Material toolbar with the app title', async ({ page }) => {
    await expect(page.locator('mat-toolbar')).toBeVisible();
    await expect(page.locator('mat-toolbar')).toContainText('VHB');
  });

  test('should render a two-column Material grid', async ({ page }) => {
    await expect(page.locator('mat-grid-list')).toHaveAttribute('cols', '2');
    await expect(page.locator('mat-grid-tile')).toHaveCount(2);
  });

  test('should render the info panel in the left tile', async ({ page }) => {
    await expect(page.locator('mat-grid-tile').first().locator('.info-panel')).toBeAttached();
  });

  test('should render the map component in the right tile', async ({ page }) => {
    await expect(page.locator('mat-grid-tile').last().locator('app-map')).toBeAttached();
  });
});

test.describe('Map component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should render the Leaflet map container', async ({ page }) => {
    await expect(page.locator('app-map .map-container')).toBeAttached();
  });

  test('should initialise a Leaflet map instance', async ({ page }) => {
    await expect(page.locator('.leaflet-container')).toBeAttached();
  });

  test('should load OpenStreetMap tile images', async ({ page }) => {
    await expect(page.locator('.leaflet-tile-pane')).toBeAttached();
  });

  test('should display the map centred on California', async ({ page }) => {
    await expect(page.locator('.leaflet-control-attribution')).toBeVisible();
    await expect(page.locator('.leaflet-control-attribution')).toContainText('OpenStreetMap');
  });
});
