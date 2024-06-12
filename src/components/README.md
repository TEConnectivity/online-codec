# Architecture

## Encoding

Following components are nested when doing encoding function : 

- Encoder 
  - CharacSelector
    - Read ? -> EncodedFrameOutput
    - ReadWrite/Write ? -> UserPayload
      - EncodedFrameOutput

The sub component appear if the options for the previous components have been filled

# Decoding