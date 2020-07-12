import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export const useDropMultiFileState = () => {
    const [files, setFiles] = useState<File[]>([]);
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFiles(acceptedFiles)
        }
    }, []);
    const clearFiles = useCallback(()=>{
        setFiles([]);
    },[]);
    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
    } = useDropzone({ noClick: true, onDrop });
    const fileUrls = files.map(image => image && URL.createObjectURL(image));
    const dropZoneInputProps = getInputProps();
    const dropZoneProps = getRootProps({ isDragActive, isDragAccept, isDragReject });

    return {
        dropZoneInputProps,
        dropZoneProps,
        fileUrls,
        setFiles,
        files,
        clearFiles
    }
}

const useDropImageState = () => {
    const [image, setImage] = useState<File>();
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setImage(acceptedFiles[0])
        }
    }, []);
    const clearImages = useCallback(()=>{
        setImage(undefined);
    },[]);
    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
    } = useDropzone({ noClick: true, onDrop });
    const imgUrl = (image && URL.createObjectURL(image));
    const imageFile = image;
    const dropZoneInputProps = getInputProps();
    const dropZoneProps = getRootProps({ isDragActive, isDragAccept, isDragReject });

    return {
        dropZoneInputProps,
        dropZoneProps,
        imgUrl,
        setImage,
        imageFile,
        clearImages
    }
}

export default useDropImageState;