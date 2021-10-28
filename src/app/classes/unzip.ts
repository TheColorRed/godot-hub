export class Unzip {

  constructor(
    private readonly path: string,
    private readonly root: string
  ) { }

  async unzip() {
    const { fs, jszip, path } = window
    const zipData = await fs.promises.readFile(this.path)
    const zip = await jszip.loadAsync(zipData)


    for (let fileKey in zip.files) {
      const zipFile = zip.files[fileKey]
      const name = zipFile.name.replace(/^Godot.+?\//, '')
      const savePath = path.join(this.root, name)

      // If this is the root don't do anything
      if (name.length <= 1) continue

      // Create any necessary directories
      if (zipFile.dir) {
        await fs.promises.mkdir(savePath)
      }
      // Write the file to disk
      else {
        const data = zipFile instanceof Buffer ? zipFile : await zipFile.async('nodebuffer')
        await fs.promises.writeFile(savePath, data)
      }
    }
  }
}
