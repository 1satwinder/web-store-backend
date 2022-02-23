import 'dotenv/config';
import { config, createSchema } from '@keystone-next/keystone/schema'
import { createAuth } from '@keystone-next/auth';
import { withItemData, statelessSessions } from '@keystone-next/keystone/session'
import { User } from './schemas/User';
import { Product } from './schemas/Product';
import { ProductImage } from './schemas/ProductImage';
import { insertSeedData } from './seed-data';
import { sendPasswordResetEmail } from './lib/mail';
import { CartItem } from './schemas/CartItem';
import { extendGraphqlSchema } from './mutations';
import { OrderItem } from './schemas/OrderItem';
import { Order } from './schemas/Order';

const dataBaseURL = process.env.DATABASE_URL || 'mongodb://localhost/keystone-sick-fits-tutorial'

const sessionConfig = {
    maxAge: 60 * 60 * 24 * 360, // how long user stayed sign in
    secret: process.env.COOKIE_SECRET,
};

const { withAuth } = createAuth({
    listKey: 'User',
    identityField: 'email',
    secretField: 'password',
    initFirstItem: {
        fields: ['name', 'email', 'password'],
        // TODO: ADD in initial roles here
    },
    passwordResetLink: {
        async sendToken(args){
            console.log(args);
            //send the email
            await sendPasswordResetEmail(args.token, args.identity);
        }
    }
});

export default withAuth(config(
    {
        server: {
            cors: {
                origin: [process.env.FRONTEND_URL],
                credentials: true,
            },
        }, 
        db: {
            adapter: 'mongoose',
            url: dataBaseURL,
            //Todo : add data seeding here
            async onConnect(keystone) {
                console.log('Connected to the database');
                if(process.argv.includes('--seed-data')){
                    await insertSeedData(keystone)
                }
            },
        },
        lists: createSchema({
            //schema item goes here
            User: User,
            Product: Product,
            ProductImage: ProductImage,
            CartItem: CartItem,
            OrderItem: OrderItem,
            Order: Order,
        }),
        extendGraphqlSchema: extendGraphqlSchema,
        ui: {
            isAccessAllowed: ({ session }) => {
                console.log(session);
                return !!session?.data
            }
        }, 
        session: withItemData(statelessSessions(sessionConfig), {
            User: 'id'
        })
    }
));
