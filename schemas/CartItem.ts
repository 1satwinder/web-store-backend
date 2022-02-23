import { list } from "@keystone-next/keystone/schema";
import { integer, relationship, select, text } from "@keystone-next/fields";

export const CartItem = list({
    // To-do:                                        
    // Access: 
    fields: {
        // Todo: create a custom label here
        quantity: integer({
            defaultValue: 1,
            isRequired: true,
        }),
        product: relationship({ ref: 'Product' }),
        user: relationship({ ref: 'User.cart' }),
    }
});
