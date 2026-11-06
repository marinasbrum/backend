import { Injectable, NotFoundException } from '@nestjs/common';
import { writeFile, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

export interface Produto {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
  disponivel: boolean;
}

@Injectable()
export class ProdutosService {
  private readonly filePath = join(process.cwd(), 'data', 'produtos.json');

  private writeQueue: Promise<void> = Promise.resolve();

  private async readProdutos(): Promise<Produto[]> {
    const content = await readFile(this.filePath, 'utf-8');
    return JSON.parse(content) as Produto[];
  }

  private async saveProdutos(produtos: Produto[]): Promise<void> {
    const content = JSON.stringify(produtos, null, 2);
    this.writeQueue = this.writeQueue.then(() =>
      writeFile(this.filePath, content, 'utf-8'),
    );
    await this.writeQueue;
  }

  async findAll(): Promise<Produto[]> {
    return this.readProdutos();
  }

  async findOne(id: number): Promise<Produto> {
    const produtos = await this.readProdutos();
    const produto = produtos.find((item) => item.id === id);
    if (!produto) throw new NotFoundException('Produto não encontrado');
    return produto;
  }

  async create(dto: CreateProdutoDto): Promise<Produto> {
    const produtos = await this.readProdutos();
    const produto: Produto = {
      id: produtos.length > 0 ? Math.max(...produtos.map((i) => i.id)) + 1 : 1,
      nome: dto.nome,
      preco: dto.preco,
      quantidade: dto.quantidade,
      disponivel: true,
    };
    produtos.push(produto);
    await this.saveProdutos(produtos);
    return produto;
  }

  async update(id: number, dto: UpdateProdutoDto): Promise<Produto> {
    const produtos = await this.readProdutos();
    const index = produtos.findIndex((item) => item.id === id);
    if (index === -1) throw new NotFoundException('Produto não encontrado');
    produtos[index] = {
      id,
      nome: dto.nome,
      preco: dto.preco,
      quantidade: dto.quantidade,
      disponivel: dto.disponivel,
    };
    await this.saveProdutos(produtos);
    return produtos[index];
  }

  async patch(id: number, dto: Partial<UpdateProdutoDto>): Promise<Produto> {
    const produtos = await this.readProdutos();
    const index = produtos.findIndex((item) => item.id === id);
    if (index === -1) throw new NotFoundException('Produto não encontrado');
    produtos[index] = { ...produtos[index], ...dto, id };
    await this.saveProdutos(produtos);
    return produtos[index];
  }

  async remove(id: number): Promise<void> {
    const produtos = await this.readProdutos();
    const filtered = produtos.filter((item) => item.id !== id);
    if (filtered.length === produtos.length)
      throw new NotFoundException('Produto não encontrado');
    await this.saveProdutos(filtered);
  }
}