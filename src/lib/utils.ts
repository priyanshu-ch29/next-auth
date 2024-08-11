import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import mongoose, { connection } from "mongoose"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const connectToDatabase = async () => {
  try {
    if(mongoose.connections && mongoose.connections[0].readyState) return

    const {connection } = await mongoose.connect(
      process.env.MONGO_URI as string,
      {
        dbName: "nextAuth",
      }
    )
    console.log(`connected to database: ${connection.host}`) 
  } catch (error) {
    throw new Error("Error conencting to the database")
  }
}