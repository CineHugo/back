import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

// Define a estrutura que esperamos receber do front-end
export interface Base64Image {
  mimeType: string;
  data: string;
}

export class ImageStorageService {
  public static async save(base64Image: Base64Image): Promise<string> {
    try {
      // 1. Extrai a extensão do arquivo (ex: 'image/png' -> 'png')
      const extension = base64Image.mimeType.split("/")[1];
      if (!extension || !['png', 'jpeg', 'jpg', 'gif'].includes(extension)) {
        throw new Error('Tipo de imagem inválido.');
      }

      // 2. Gera um nome de arquivo único
      const uniqueName = `${crypto.randomBytes(16).toString("hex")}.${extension}`;

      // 3. Define o caminho para a pasta 'uploads' na raiz do projeto
      const uploadsDir = path.resolve(__dirname, '..', '..', 'uploads');
      const filePath = path.join(uploadsDir, uniqueName);
      
      // 4. Garante que o diretório 'uploads' exista
      await fs.mkdir(uploadsDir, { recursive: true });

      // 5. Decodifica a string Base64 para um buffer binário
      // O 'replace' remove o cabeçalho "data:image/png;base64," se ele vier do front-end
      const imageBuffer = Buffer.from(
        base64Image.data.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );

      // 6. Salva o arquivo no disco
      await fs.writeFile(filePath, imageBuffer);

      // 7. Retorna a URL pública completa do arquivo
      const fileUrl = `${process.env.APP_URL}/files/${uniqueName}`;
      return fileUrl;

    } catch (error) {
      console.error("Erro ao salvar imagem:", error);
      throw new Error("Falha ao salvar o arquivo de imagem.");
    }
  }
}