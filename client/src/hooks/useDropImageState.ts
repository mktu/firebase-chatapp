import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export const useDropMultiImageState = () => {
    const [images, setImages] = useState<File[]>([]);
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setImages(acceptedFiles)
        }
    }, []);
    const clearImages = useCallback(()=>{
        setImages([]);
    },[]);
    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
    } = useDropzone({ noClick: true, onDrop });
    const imgUrls = images.map(image => image && URL.createObjectURL(image));
    const imageFiles = images;
    const dropZoneInputProps = getInputProps();
    const dropZoneProps = getRootProps({ isDragActive, isDragAccept, isDragReject });

    return {
        dropZoneInputProps,
        dropZoneProps,
        imgUrls,
        setImages,
        imageFiles,
        clearImages
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