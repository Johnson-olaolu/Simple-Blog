import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const newPost = this.postRepository.create(createPostDto);
    await newPost.save();
    return newPost;
  }

  async findAll() {
    const allPosts = await this.postRepository.find();
    return allPosts;
  }

  async findOne(id: number) {
    const selectedPost = await this.postRepository.findOneBy({
      id: id,
    });
    if (!selectedPost) {
      throw new NotFoundException('Post Not Found for this Id');
    }
    return selectedPost;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const postToUpdate = await this.findOne(id);
    for (const detail in updatePostDto) {
      postToUpdate[detail] = postToUpdate[detail];
    }
    await postToUpdate.save();
    return postToUpdate;
  }

  async remove(id: number) {
    const deleteResponse = await this.postRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new NotFoundException('Post Not Found for this Id');
    }
    return true;
  }
}
