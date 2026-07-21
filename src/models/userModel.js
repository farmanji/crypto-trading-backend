import mongoose from 'mongoose';


const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, 'Full name is required'],
            trim: true, 
            maxlength: [50, 'Name cannot exceed 50 characters']
        },
        email: {
            type: String,
            required: [true, 'Email address is required'],
            unique: true, 
            lowercase: true, 
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email address'
            ]
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters long'],
            select: false 
        },
        isTermsAccepted: {
            type: Boolean,
            required: [true, 'You must accept the terms of service'],
            enum: [true] 
        }
    },
    {
        timestamps: true 
    }
);

// Compile the schema into a reusable database Model
const User = mongoose.model('User', userSchema);

export default User;
