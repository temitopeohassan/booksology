import { create } from 'ipfs-http-client';

class IPFSService {
  private ipfs;

  constructor() {
    this.ipfs = create({ url: process.env.IPFS_NODE_URL || 'http://localhost:5001' });
  }

  async uploadFile(buffer: Buffer) {
    const result = await this.ipfs.add(buffer);
    return result.cid.toString();
  }

  async getFile(cid: string) {
    const chunks = [];
    for await (const chunk of this.ipfs.cat(cid)) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }
}

export default new IPFSService();