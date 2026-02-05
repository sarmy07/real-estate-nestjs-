import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { InquiriesService } from './inquiries.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryDto } from './dto/update-inquiry.dto';

@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Post()
  create(
    @Param('propertyId') propertyId: number,
    @Body() createInquiryDto: CreateInquiryDto,
    @Req() req,
  ) {
    return this.inquiriesService.create(createInquiryDto, propertyId, req.user);
  }

  @Get()
  findAll() {
    return this.inquiriesService.findAll();
  }

  @Get('sent')
  sent(@Req() req) {
    return this.inquiriesService.getMySentInquiries(req.user);
  }

  @Get('received')
  received(@Req() req) {
    return this.inquiriesService.getMyReceivedInquiries(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inquiriesService.findOne(+id);
  }

  @Patch(':id/respond')
  respond(@Param('id') id: number, @Req() req) {
    return this.inquiriesService.markedAsRespond(id, req.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInquiryDto: UpdateInquiryDto) {
    return this.inquiriesService.update(+id, updateInquiryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inquiriesService.remove(+id);
  }
}
