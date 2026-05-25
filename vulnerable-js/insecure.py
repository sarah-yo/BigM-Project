# unsafe deserialization example
import pickle
import sys

def load_object(path):
    with open(path, 'rb') as f:
        # insecure: untrusted pickle load
        obj = pickle.load(f)
    return obj

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("usage: python insecure.py file.pkl")
    else:
        print(load_object(sys.argv[1]))
