#!/usr/bin/env python3
"""
    File:       build_ext.py
    Purpose:    Utility script to quickly build the extension.
    Creator:    WakandaO2 (17/03/2020)
"""

import os.path
import sys
import zipfile


SOURCE_DIRECTORY_NAME = "src"
BUILT_EXTENSION_FILENAME = "MALAssistant.xpi"


def get_build_files(src_dir):
    """
    Retrieve the list of files to insert into build.
    """
    build_files = []

    for root, _, files in os.walk(os.curdir):
        for in_file in files:
            build_files.append(os.path.join(root, in_file))

    return build_files


def main(ext_dir):
    last_dir = os.path.abspath(os.curdir)
    src_dir = os.path.join(ext_dir, SOURCE_DIRECTORY_NAME)

    os.chdir(src_dir)
    build_files = get_build_files(src_dir)

    with zipfile.ZipFile(os.path.join(last_dir, BUILT_EXTENSION_FILENAME), "w") as opened_zip:
        for build_file in build_files:
            opened_zip.write(build_file)

    print(f'Extension "{BUILT_EXTENSION_FILENAME}" succesfully built!')


if __name__ == "__main__":
    # If no directory is given, we assume the script 
    # is running from the repository's root.
    ext_dir = os.curdir if (len(sys.argv) < 2) else sys.argv[1]
    main(ext_dir)
