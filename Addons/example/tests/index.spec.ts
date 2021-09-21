import ImageEditor from '@src/imageEditor'
import path from 'path'

describe('Edits images', () => {
  it('Parses and save image', async () => {
    const editor = new ImageEditor({ w: 1920, h: 1080 })
    const layer = editor.ensureLayer()
    layer.setImage({
      url: path.join(__dirname, 'assets', 'jawoodle.jpeg'),
      posX: 0,
      posY: 0,
      imgWidth: 500,
    })

    layer.setText({
      text: 'Jawoodle',
      posX: 500,
      posY: 0,
      font: '150px sans-serif',
      baseline: 'hanging',
      align: 'start',
    })

    const render = await editor.render()
    await render.save({
      path: path.join(__dirname, 'out', 'jawoodle.png'),
      format: 'png',
    })
  })
})
