import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const VideoSchema = new Schema (
    {
        videoFile:{
            type : String, // cloudnary url
            required : true,
        },
        ThumbNail:{
            type : String, // cloudnary url
            required : true,
        },
        Title:{
            type : String, 
            required : true,
        },
        Description:{
            type : String,
            required : true,
        },        
        Duration:{
            type : String, // cloudnary url
            required : true,
        },
        views:{
            type : Number,
            default : 0,
        },
        isPublished:{
            type : boolean, 
            default : true, 
        },
        owner:{
            type : Schema.Types.ObjectId,
            ref :"User" 
        },
    },
    {
        timestamps : true,
    }
)






export const Video = mongoose.model("Video",VideoSchema) 