import {IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class PostCategoryDto{
    @ApiProperty()
    @IsString()
    public category: string;
}