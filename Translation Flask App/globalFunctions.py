import uuid
import os

def unique_filename(directory, extension):


    # Call the function to empty the folder
    empty_folder(directory)
    # Generate a UUID (Universally Unique Identifier)
    unique_id = str(uuid.uuid4())

    # Extract the first 8 characters to create a unique file name
    unique_filename = unique_id[:8]

    # Append the desired file extension
    unique_filename_with_extension = unique_filename + extension

    # Join the directory path and the unique filename
    unique_file_path = os.path.join(directory, unique_filename_with_extension)

    return unique_file_path


def empty_folder(folder_path):
    try:
        # List all files in the folder
        file_list = os.listdir(folder_path)

        # Loop through the files and delete them
        for filename in file_list:
            file_path = os.path.join(folder_path, filename)
            if os.path.isfile(file_path):
                print("file:",file_path)
                os.remove(file_path)

        print(f"All files in '{folder_path}' have been deleted.")
    except Exception as e:
        print(f"An error occurred: {str(e)}")


def uploadedFilePath(folder_path):
    try:
        # List all files in the folder
        file_list = os.listdir(folder_path)
        print(f"upload account: {str(file_list)}")
        filePath= folder_path + file_list[0]

        return filePath

        # Loop through the files
        for filename in file_list:
            file_path = os.path.join(folder_path, filename)
            if os.path.isfile(file_path):
                print("file:",file_path)
                return file_path

        print(f"Uploaded files.")
    except Exception as e:
        print(f"An error occurred: {str(e)}")




