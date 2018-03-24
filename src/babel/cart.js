const GUT = [
  'getConfigurableCartItem',
  'getCartItemForReconfiguration',
  'addSkuIdFromConfigurableProduct',
  'addProductIdFromConfigurableProduct',
  'createChildItemTree',
  'updateChildTreeProductData',
  'getChildItemsDataAsCartItems',
  'getAddonDataAsCartItems',
  'updateChildItemPrices',
  'getChildItemsAsCartItems',
  'checkCpqItemValidity',
  'getChildItemsCookie',
  'sendGWPMessages',
  'filterInactiveAddons',
  'removeChildItemsByProduct',
  'removeUnlinkedAddonItems',
  'processInvalidAddonItems',
  'handleInvalidAddonItem',
  'addMultipleCoupons',
  'addMultipleGiftCards',
  'pendingPaymentGiftCardCheck',
  'updateGiftCardDetailsForPendingPayment',
  'pendingPaymentRemoveGiftCard',
  'handleGiftCardErrorPendingPayment',
  'reApplyGiftCardPins',
  'removeGiftCard',
  'handleCurrencyPricingError',
  'handleGiftCardError',
  'updateGiftCardDetails',
  'updateRemainingAmount',
  'addGiftDataToItem',
  'updatePlaceHolderItems',
  'removePlaceHolderFromCart',
  'sendGWPMessages',
  'splitItems',
  'requestQuote',
  'rejectQuote',
  'loadTemplateOrderItems',
  'removeChildItemFromCart',
  'editChildItemFromCart',
  'addAddOnChildItemsToCartItem',
  'populateGiftCards',
  'validateGiftCards'
];

const removals = require('../helpers/removals.js');

const visitor = () => {

  return {
    visitor: Object.assign({}, removals.removeFunctionDefinitions(GUT), removals.removeFunctionCalls(GUT))
  };
};

module.exports = visitor;
