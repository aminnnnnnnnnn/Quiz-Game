import {Injectable, NotFoundException} from "@nestjs/common";
import {GetQuestionDto} from "../../dto/GetQuestionDto";
import {Question} from "../../model/Question";
import {createQueryBuilder, EntityManager, Repository, Transaction} from 'typeorm';
import {Category} from "../../model/Category";
import {GetCategoryDto} from "../../dto/GetCategoryDto";
import {MessageResultDto} from "../../dto/MessageResultDto";
import {PostQuestionDto} from "../../dto/PostQuestionDto";
import {PostCategoryDto} from "../../dto/PostCategoryDto";
import * as path from "path";


@Injectable()
export class AdminService {
    protected readonly questionRepository: Repository<Question>;
    protected readonly categoryRepository: Repository<Category>;

    constructor(private questionManager: EntityManager, private categoryManager: EntityManager) {
        this.questionRepository = questionManager.getRepository(Question);
        this.categoryRepository = categoryManager.getRepository(Category);
    }

//Eine Frage
    async getQuestion(question_id: number): Promise<GetQuestionDto> {
        try {
            const question: Question | null = await this.questionRepository.findOneBy(
                {questionId: question_id});
            if (question == null) {
                throw new NotFoundException();
            }
            return new GetQuestionDto(question);
        } catch (e) {
            throw new Error(e);
        }
    }


    //Alle Fragen
    async getAllQuestion(): Promise<GetQuestionDto[]> {
        try {
            const questions: Question[] | null = await this.questionRepository.find({relations: {categories: true}});
            if (questions == null) {
                throw new NotFoundException();
            }
            //mappen aller werte
            const questionDtos: GetQuestionDto[] = questions.map(question => new GetQuestionDto(question));
            return questionDtos;
        } catch (e) {
            throw new Error(e);
        }
    }

//Eine Kategorie
    async getCategory(category_id: number): Promise<GetCategoryDto> {
        try {
            const category: Category | null = await this.categoryRepository.findOneBy(
                {categoryId: category_id,}
            );
            if (category == null) {
                throw new NotFoundException();
            }
            return new GetCategoryDto(category);
        } catch (e) {
            throw new Error(e);
        }
    }

//Alle Kategorien
    async getAllCategory(): Promise<GetCategoryDto[]> {
        try {
            const categories: Category[] | null = await this.categoryRepository.find();
            if (categories == null) {
                throw new NotFoundException();
            }
            const categoryDtos: GetCategoryDto[] = categories.map(category => new GetCategoryDto(category));
            return categoryDtos;
        } catch (e) {
            throw new Error(e);
        }
    }

//Anlegen einer neuen Frage

    async createQuestion(body: PostQuestionDto): Promise<MessageResultDto> {
        try {
            const question = Question.create(
                body.question,
                body.answer1,
                body.answer2,
                body.answer3,
                body.answer4,
                body.solution,
                body.categories
            )
            //await this.questionRepository.save(question);
            await this.questionRepository.manager.save(question);
            return new MessageResultDto(`Frage: ${question.question} wurde neu angelegt.`);
        } catch (e) {
            throw new Error(e);
        }
    }

//Anlegen einer neuen Kategorie
    async createCategory(body: PostCategoryDto): Promise<MessageResultDto> {
        try {
            const category: Category = Category.create(body.category);
            await this.categoryRepository.save(category);
            return new MessageResultDto(`Kategorie: ${category.category} wurde neu angelegt.`)
        } catch (e) {
            throw new Error(e);
        }
    }

    //Eine Frage bearbeiten (PUT)
    async editQuestion(question_id: number, body: PostQuestionDto): Promise<MessageResultDto> {
        try {
            const old: Question | null = await this.questionRepository.findOneBy({
                questionId: question_id
            });
            if (old == null) {
                throw new NotFoundException();
            }
            old.question = body.question;
            old.answer1 = body.answer1;
            old.answer2 = body.answer2;
            old.answer3 = body.answer3;
            old.answer4 = body.answer4;
            old.solution = body.solution;
            old.categories = body.categories;
            await this.questionRepository.save(old);
            return new MessageResultDto(`Frage: ${old.question} wurde bearbeitet`);
        } catch (e) {
            throw new Error(e);
        }
    }


    /* Funktioniert nicht, weil update nicht bei manyToMany geht. Muss man manuell machen
        async editQuestion(question_id: number, body: PostQuestionDto): Promise<MessageResultDto> {
            try {
                const updateResult = await this.questionRepository.update(
                    { questionId: question_id },
                    {
                        question: body.question,
                        answer1: body.answer1,
                        answer2: body.answer2,
                        answer3: body.answer3,
                        answer4: body.answer4,
                        solution: body.solution,
                        categories: body.categories,
                    }
                );
                if (updateResult.affected === 0) {
                    throw new NotFoundException();
                }
                return new MessageResultDto(`Frage: ${body.question} wurde bearbeitet`);
            } catch (e) {
                throw new Error(e);
            }
        }
        */

    //Bearbeiten einer Kategorie
    async editCategory(category_id: number, body: PostCategoryDto): Promise<MessageResultDto> {
        try {
            const updateResult = await this.categoryRepository.update(
                {categoryId: category_id},
                {
                    category: body.category
                }
            );
            if (updateResult == null) {
                throw new NotFoundException();
            }
            return new MessageResultDto(`Kategorie: ${body.category} wurde bearbeitet`)
        } catch (e) {
            throw e;
        }
    }

    //Löscht eine Frage
    async deleteQuestion(question_id: number): Promise<MessageResultDto> {
        try {
            const deleteResult = await this.questionRepository.delete(
                {questionId: question_id}
            );
            if (deleteResult == null) {
                throw new NotFoundException();
            }
            return new MessageResultDto(`Frage: ${question_id} wurde gelöscht!`)
        } catch (e) {
            throw e;
        }
    }

    //Löscht eine Kategorie
    /*
    async deleteCategory(category_id: number) {
     try {
         const deleteResult = await this.categoryRepository.delete(
             {categoryId: category_id}
         );
         if (deleteResult == null) {
             throw new NotFoundException();
         }
         return new MessageResultDto(`Kategorie: ${category_id} wurde gelöscht!`);
     } catch (e) {
         throw e;
     }
    }
*/

    //Löscht eine Kategorie und die dazugehörigen Fragen aus der Verknüpfungstabelle (unschön)
    async deleteCategory(category_id: number): Promise<MessageResultDto> {
        try {
            const category = await this.categoryRepository.findOneBy(
                {categoryId: category_id}
            );
            if (category == null) {
                throw new NotFoundException();
            }
            //leeren der Verknüpften Fragen
            category.questions = []
            await this.categoryRepository.save(category);
            const deleteResult = await this.categoryRepository.delete({categoryId: category_id});
            if (deleteResult == null) {
                throw new NotFoundException();
            }
            return new MessageResultDto(`Kategorie: ${category_id} wurde gelöscht!`);
        } catch (e) {
            throw e;
        }
    }

    //Alle Fragen abfragen die zu einer bestimmten Kategorie gehören
    async getQuestionsByCategory(category_id: number): Promise<GetQuestionDto[]>  {
        try {
            const raw: Question[] = await this.categoryManager.query(
                `SELECT q.questionId, q.question, q.answer1, q.answer2, q.answer3, q.answer4, q.solution FROM question q INNER JOIN question_category qc ON q.questionId = qc.questionQuestionId WHERE qc.categoryCategoryId = ${category_id};`)
            if (raw.length == 0) {
                throw new NotFoundException(`Kategorie mit ID ${category_id} wurde nicht gefunden.`);
            }
            const questionsDtos: GetQuestionDto[] = raw.map(question => new GetQuestionDto(question));
            return questionsDtos;

        } catch (e) {
            throw e;
        }
    }
}

//ToDo: deleteCategory als Transaction bauen
//ToDo: Bei einer Frage müssen noch die categories mit ausgegeben werden








