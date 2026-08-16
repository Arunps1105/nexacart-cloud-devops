resource "aws_vpc" "nexacart" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name    = "nexacart-vpc"
    Project = "NexaCart"
  }
}


data "aws_availability_zones" "available" {
  state = "available"
}

resource "aws_subnet" "public_1" {
  vpc_id                  = aws_vpc.nexacart.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = true

  tags = {
    Name    = "nexacart-public-1"
    Project = "NexaCart"
  }
}

resource "aws_subnet" "public_2" {
  vpc_id                  = aws_vpc.nexacart.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = data.aws_availability_zones.available.names[1]
  map_public_ip_on_launch = true

  tags = {
    Name    = "nexacart-public-2"
    Project = "NexaCart"
  }
}

resource "aws_subnet" "private_1" {
  vpc_id            = aws_vpc.nexacart.id
  cidr_block        = "10.0.11.0/24"
  availability_zone = data.aws_availability_zones.available.names[0]

  tags = {
    Name    = "nexacart-private-1"
    Project = "NexaCart"
  }
}

resource "aws_subnet" "private_2" {
  vpc_id            = aws_vpc.nexacart.id
  cidr_block        = "10.0.12.0/24"
  availability_zone = data.aws_availability_zones.available.names[1]

  tags = {
    Name    = "nexacart-private-2"
    Project = "NexaCart"
  }
}

resource "aws_internet_gateway" "nexacart" {
  vpc_id = aws_vpc.nexacart.id

  tags = {
    Name    = "nexacart-igw"
    Project = "NexaCart"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.nexacart.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.nexacart.id
  }

  tags = {
    Name    = "nexacart-public-rt"
    Project = "NexaCart"
  }
}

resource "aws_route_table_association" "public_1" {
  subnet_id      = aws_subnet.public_1.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_2" {
  subnet_id      = aws_subnet.public_2.id
  route_table_id = aws_route_table.public.id
}

resource "aws_eip" "nat" {
  domain = "vpc"

  tags = {
    Name    = "nexacart-nat-eip"
    Project = "NexaCart"
  }
}

resource "aws_nat_gateway" "nexacart" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public_1.id

  depends_on = [aws_internet_gateway.nexacart]

  tags = {
    Name    = "nexacart-nat"
    Project = "NexaCart"
  }
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.nexacart.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nexacart.id
  }

  tags = {
    Name    = "nexacart-private-rt"
    Project = "NexaCart"
  }
}

resource "aws_route_table_association" "private_1" {
  subnet_id      = aws_subnet.private_1.id
  route_table_id = aws_route_table.private.id
}

resource "aws_route_table_association" "private_2" {
  subnet_id      = aws_subnet.private_2.id
  route_table_id = aws_route_table.private.id
}