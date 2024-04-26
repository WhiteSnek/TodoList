import mongoose, {Schema} from 'mongoose'

const taskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    list: {
        type: Schema.Types.ObjectId,
        ref: "List",
    },
    isActive: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true
})


export const Task = mongoose.model("Task",taskSchema)