import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { GetQuestionDto } from '../../dto/GetQuestionDto';
import { IsAdminGuard } from '../../is-admin/is-admin.guard';
import { GetCategoryDto } from '../../dto/GetCategoryDto';
import { MessageResultDto } from '../../dto/MessageResultDto';
import { PostQuestionDto } from '../../dto/PostQuestionDto';
import { PostCategoryDto } from '../../dto/PostCategoryDto';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  //eine Frage
  @Get('/question/:question_id')
  @UseGuards(IsAdminGuard)
  async getQuestion(
    @Param('question_id', ParseIntPipe) question_id: number,
  ): Promise<GetQuestionDto> {
    return this.adminService.getQuestion(question_id);
  }

  //alle Fragen
  @Get('questions')
  async getAllQuestion(): Promise<GetQuestionDto[]> {
    return this.adminService.getAllQuestion();
  }

  //alle Fragen, die zu einer Kategorie gehören
  @Get('/questions/:category_id')
  async getQuestionsByCategory(
    @Param('category_id', ParseIntPipe) category_id: number,
  ): Promise<GetQuestionDto[]> {
    return this.adminService.getQuestionsByCategory(category_id);
  }

  //eine Kategorie
  @Get('category/:category_id')
  @UseGuards(IsAdminGuard)
  async getCategory(
    @Param('category_id', ParseIntPipe) category_id: number,
  ): Promise<GetCategoryDto> {
    return this.adminService.getCategory(category_id);
  }

  //alle Kategorien
  @Get('categories')
  async getAllCategory(): Promise<GetCategoryDto[]> {
    return this.adminService.getAllCategory();
  }

  //Neue Frage anlegen

  @Post('question')
  @UseGuards(IsAdminGuard)
  async postQuestion(@Body() body: PostQuestionDto): Promise<MessageResultDto> {
    return this.adminService.createQuestion(body);
  }

  //Neue Kategorie anlegen
  @Post('category')
  @UseGuards(IsAdminGuard)
  async postCategory(@Body() body: PostCategoryDto): Promise<MessageResultDto> {
    return this.adminService.createCategory(body);
  }

  //Frage updaten
  @Put('question/:question_id')
  @UseGuards(IsAdminGuard)
  async editQuestion(
    @Param('question_id', ParseIntPipe) question_id: number,
    @Body() body: PostQuestionDto,
  ): Promise<MessageResultDto> {
    console.log(body);
    console.log(question_id);
    return this.adminService.editQuestion(question_id, body);
  }

  //Ändert den Namen einer Kategorie
  @Put('category/:category_id')
  @UseGuards(IsAdminGuard)
  async editCategory(
    @Param('category_id', ParseIntPipe) category_id: number,
    @Body() body: PostCategoryDto,
  ): Promise<MessageResultDto> {
    return this.adminService.editCategory(category_id, body);
  }

  //Löscht eine bestimmte Frage
  @Delete('question/:question_id')
  @UseGuards(IsAdminGuard)
  async deleteQuestion(
    @Param('question_id', ParseIntPipe) question_id: number,
  ): Promise<MessageResultDto> {
    return this.adminService.deleteQuestion(question_id);
  }

  //löschen einer bestimmten Kategorie und den dazugehörigen Fragen in der Verknüpfungstabelle
  @Delete('category/:category_id')
  @UseGuards(IsAdminGuard)
  async deleteCategory(
    @Param('category_id', ParseIntPipe) category_id: number,
  ): Promise<MessageResultDto> {
    return this.adminService.deleteCategory(category_id);
  }
}

//ToDo: Admin Guard
//ToDo: GET Alle Fragen, die zu einer bestimmten Kategorie gehören
//ToDo: GET für Fragen, Kategorien könnte auch in den Game Controller bzw keine Adminrechte
//ToDo: Eventuell Routen um User zu löschen
