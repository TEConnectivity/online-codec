import { Link, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger } from "@chakra-ui/react";

interface MyComponentProps {
  children: string;
  header: string;
  body: string;
}

export default function App({ children, header, body }: MyComponentProps) {


  return (
    <Popover placement="top">
      <PopoverTrigger>
        <Link color="teal.500" >{children}</Link>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>{header}</PopoverHeader>
        <PopoverBody>{body}</PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
