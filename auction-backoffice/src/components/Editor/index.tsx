import ReactQuill from 'react-quill'
interface EditorProps {
  value: string
  setValue: (value: string) => void
  id?: string
}

function Editor({ value, setValue, id = '' }: EditorProps) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image'],
      ['clean']
    ]
  }

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image'
  ]

  return <ReactQuill theme='snow' id={id} value={value} onChange={setValue} modules={modules} formats={formats} />
}
export default Editor
