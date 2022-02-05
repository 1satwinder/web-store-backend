import { list } from "@keystone-next/keystone/schema";
import { integer, relationship, select, text } from "@keystone-next/fields";

export const Product = list({
    // To-do:                                        
    // Access: 
    fields: {
        name: text({ isRequired: true }),
        description: text({
            ui: {
                displayMode: 'textarea'
            },
        }),
        photo: relationship({
            ref: 'ProductImage.product',
            ui: {
                displayMode:'cards',
                cardFields: ['image', 'altText'],
                inlineCreate: {fields: ['image','altText']},
                inlineEdit: {fields: ['image', 'altText']},
            },
        }),
        status : select({
            options: [
                {label: 'Draft', value: 'Draft'},
                {label: 'Available', value: 'AVAILABLE'},
                { label: 'Unavailable', value: 'UNAVAILABLE'}
            ],
            defaultValue: 'Draft',
            ui: {
                displayMode: 'segmented-control',
                // createView: {fieldMode: 'hidden'}
            },
        }),
        price: integer({}),
        //To-do photo
    }
})

 