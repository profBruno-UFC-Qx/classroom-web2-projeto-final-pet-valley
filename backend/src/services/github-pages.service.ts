import { Octokit } from 'octokit';
import dotenv from 'dotenv';

dotenv.config();

export class GitHubPagesService {
    private octokit: Octokit;
    private owner: string;
    private repo: string;
    private branch: string;

    constructor() {
        const token = process.env.GITHUB_TOKEN;
        this.owner = process.env.GITHUB_OWNER || '';
        this.repo = process.env.GITHUB_REPO || '';
        this.branch = process.env.GITHUB_BRANCH || 'main';

        if (!token || !this.owner || !this.repo) {
            throw new Error('Configuração do GitHub incompleta. Verifique GITHUB_TOKEN, GITHUB_OWNER e GITHUB_REPO.');
        }

        this.octokit = new Octokit({ auth: token });
        console.log('GitHub Pages Service configurado com sucesso!');
    }

    async uploadImages(files: Express.Multer.File[]): Promise<string[]> {
        const uploadPromises = files.map(file => this.uploadSingleImage(file));
        return await Promise.all(uploadPromises);
    }

    async uploadSingleImage(file: Express.Multer.File): Promise<string> {
        try {
            const fileName = this.generateFileName(file.originalname);
            const filePath = `images/${fileName}`;
            // Converter buffer para base64
            const fileContent = file.buffer.toString('base64');
            // Fazer upload para o GitHub
            const response = await this.octokit.rest.repos.createOrUpdateFileContents({
                owner: this.owner,
                repo: this.repo,
                path: filePath,
                message: `Adiciona imagem: ${fileName}`,
                content: fileContent,
                branch: this.branch,
            });

            const fileSha = response.data.commit.sha;

            // Gerar URL pública
            const imageUrl = `https://raw.githubusercontent.com/${this.owner}/${this.repo}/${this.branch}/${filePath}`;
            return imageUrl;

        } catch (error: any) {
            console.error('Erro no upload para GitHub:', error);

            if (error.status === 401) {
                throw new Error('Token do GitHub inválido ou expirado.');
            }

            if (error.status === 404) {
                throw new Error('Repositório não encontrado. Verifique GITHUB_OWNER e GITHUB_REPO.');
            }

            throw new Error(`Falha no upload: ${error.message}`);
        }
    }

    async deleteImage(imageUrl: string): Promise<void> {
        try {
            // Extrair o caminho do arquivo da URL
            const filePath = this.extractPathFromUrl(imageUrl);

            // Primeiro, precisamos obter o SHA do arquivo
            const { data: fileData } = await this.octokit.rest.repos.getContent({
                owner: this.owner,
                repo: this.repo,
                path: filePath,
                branch: this.branch,
            });

            // Type guard para verificar se é um arquivo
            if (Array.isArray(fileData)) {
                throw new Error('Caminho é um diretório, não um arquivo');
            }

            await this.octokit.rest.repos.deleteFile({
                owner: this.owner,
                repo: this.repo,
                path: filePath,
                message: `Remove imagem: ${this.getFileNameFromPath(filePath)}`,
                branch: this.branch,
                sha: fileData.sha,
            });
        } catch (error: any) {
            console.error('Erro ao deletar imagem do GitHub:', error);
            throw error;
        }
    }

    private extractPathFromUrl(url: string): string {
        const baseUrl = `https://raw.githubusercontent.com/${this.owner}/${this.repo}/${this.branch}/`;
        return url.replace(baseUrl, '');
    }

    private getFileNameFromPath(filePath: string): string {
        return filePath.split('/').pop() || filePath;
    }

    private generateFileName(originalName: string): string {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        const extension = originalName.split('.').pop();
        const nameWithoutExtension = originalName.replace(/\.[^/.]+$/, "");

        return `${nameWithoutExtension}_${timestamp}_${random}.${extension}`;
    }

    isReady(): boolean {
        return !!this.octokit;
    }
}