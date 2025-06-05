import {IsArray, IsInt, IsString, MinLength} from 'class-validator';
import {Category} from "../model/Category";
import {ApiProperty} from "@nestjs/swagger";

export class PostQuestionDto {
    @ApiProperty()
    @IsString()
    public question: string;

    @ApiProperty()
    @IsString()
    public answer1: string;

    @ApiProperty()
    @IsString()
    public answer2: string;

    @ApiProperty()
    @IsString()
    public answer3: string;

    @ApiProperty()
    @IsString()
    public answer4: string;

    @ApiProperty()
    @IsInt()
    public solution: number;

    @ApiProperty()
    @IsArray()
    public categories: Category[];
}
