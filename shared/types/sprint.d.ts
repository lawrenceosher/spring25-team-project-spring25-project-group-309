import { Request } from 'express';
import { ObjectId } from 'mongodb';

export interface Sprint {
    tasks: ObjectId[];
    name: string;
    project: ObjectId;
    status: string;
    start_date: Date;
    end_date: Date;
}

export interface DatabaseSprint extends Sprint {
    _id: ObjectId;
}