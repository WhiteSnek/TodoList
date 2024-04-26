import mongoose, {Schema} from 'mongoose'

const listSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
},
{
    timestamps: true
})


export const List = mongoose.model("List",listSchema)