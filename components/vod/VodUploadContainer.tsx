import FileButton from '../FileButton'

const VodUploadContainer: React.FC = () => {
  return (
    <div>
      Hello Upload
      <FileButton id="file" name="file" accept="video/*" />
      <FileButton id="file-2" name="file-2" accept="video/*" className="dark-single" />
    </div>
  )
}

export default VodUploadContainer
