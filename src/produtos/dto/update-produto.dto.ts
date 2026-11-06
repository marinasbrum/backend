import { CreateProdutoDto } from './create-produto.dto';

export class UpdateProdutoDto extends CreateProdutoDto {
  disponivel: boolean;
}