/**
 * ANKI WEB DOM SELECTORS
 * Fonte da verdade para todos os seletores CSS do AnkiWeb
 */
export const ANKI_SELECTORS = {
  global: {
    body: 'body',
    navbar: 'nav.navbar',
    navbarContainer: 'nav.navbar .container',
    navbarBrand: 'a.navbar-brand',
    navbarLinks: '.navbar-nav .nav-link',
    mainContainer: 'main.container',
    footer: 'body > div.container-fluid.bg-gray',
    loadingSpinner: '.spinner-border',
    alerts: '.alert',
  },
  decksPage: {
    container: '#deckList',
    deckItem: '.deck',
    deckLink: '.deck > a.deckname',
    deckName: '.deckname',
    counts: {
      new: '.new-count',
      learn: '.learn-count',
      review: '.review-count',
      zero: '.zero-count'
    },
    actions: 'button.btn-link', 
    searchBar: 'input[type="search"]'
  },
  studyPage: {
    wrapper: '#content',
    qaContainer: '#qa', 
    card: '.card',
    headerStats: '#header', 
    bottomArea: '.bottom',
    answerButtons: '#ansbut',
    easeButtons: 'button[id^="ansbut"]',
    images: '#qa img',
    audioButtons: '.replay-button'
  },
  editorPage: {
    form: 'form',
    fieldsContainer: '#fields',
    fieldGroup: '.form-group',
    label: 'label',
    input: '.form-control',
    richTextEditor: '.editable',
    tagEditor: '#tags',
    toolbar: '.btn-toolbar',
    saveButton: 'button.btn-primary'
  },
  authPage: {
    loginForm: 'form[action*="login"]',
    emailInput: 'input[name="username"]',
    passwordInput: 'input[type="password"]',
    submitButton: 'button[type="submit"]'
  }
} as const;
