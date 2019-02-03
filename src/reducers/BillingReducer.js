import * as constants from '../constants';
/**
 * This is the Billing reducer which handles updating state to store information about the user's current billing cycle how much
 * will be billed and on which date as well as how to cancel it.
 * @param state Object current state
 * @param action Object action being dispatched (includes action.payload which is the data)
 * @returns {{result: *}}
 */
export default (state = {}, action) => {
    switch (action.type) {
        case constants.BILLING_SUCCESS:
            const {
                customer_id,
                invoice_amount,
                invoice_date, // Period Start date in unix timestamp
                next_invoice_date, // Period end date in unix timestamp
                next_invoice_amount,
                invoice_status,
                payment_card_type,
                payment_last_four,
                subscription_active,
                premium,
                plan,
                plan_id,
                subscription_id,
                trial_end
            } = action.payload;

            console.log(action.payload);

            return {
                ...state,
                isFetching: false,
                error: null,
                customer_id,
                next_invoice_amount,
                invoice_status,
                payment_card_type,
                payment_last_four,
                subscription_active,
                next_invoice_date,
                invoice_date,
                invoice_amount,
                premium,
                plan,
                plan_id,
                subscription_id,
                trial_end,
            };
        case constants.BILLING_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: action.payload,
            };
        default:
            return {
                ...state
            }
    }
}
